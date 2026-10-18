// One-time, non-destructive copy. Never writes to the source dataset.
require('@next/env').loadEnvConfig(process.cwd());
const {createClient}=require('@sanity/client');
const targetName='portfolio_v2';
const source=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:'production',apiVersion:'2025-02-19',useCdn:false,token:process.env.SANITY_API_WRITE_TOKEN});
const target=source.withConfig({dataset:targetName});
async function main(){
 const datasets=await source.datasets.list();
 if(!datasets.some(d=>d.name===targetName)) await target.datasets.create(targetName,{aclMode:'public'});
 if(await target.fetch('count(*[!(_type match "system.*") && !(_type in ["sanity.imageAsset", "sanity.fileAsset"])])',{}, {perspective:'raw'})) throw new Error('Target is not empty; refusing to overwrite content.');
 const docs=await source.fetch('*',{}, {perspective:'raw'});
 const signature=items=>JSON.stringify(items.map(d=>[d._id,d._rev]).sort((a,b)=>a[0].localeCompare(b[0])));
 const before=signature(docs);
 const ids=new Map();
 const existingAssets=new Set(await target.fetch('*[_type in ["sanity.imageAsset","sanity.fileAsset"]]._id'));
 const assets=docs.filter(d=>['sanity.imageAsset','sanity.fileAsset'].includes(d._type));
 for(const asset of assets){
  if(existingAssets.has(asset._id)){ids.set(asset._id,asset._id);continue;}
  const u=new URL(asset.url);
  if(u.origin!=='https://cdn.sanity.io') throw new Error('Unexpected asset origin');
  const res=await fetch(u); if(!res.ok) throw new Error('Asset download failed');
  const uploaded=await target.assets.upload(asset._type==='sanity.imageAsset'?'image':'file',Buffer.from(await res.arrayBuffer()),{filename:asset.originalFilename,contentType:asset.mimeType});
  ids.set(asset._id,uploaded._id);
  console.log(`Copied asset ${ids.size}/${assets.length}`);
 }
 function remap(value){
  if(Array.isArray(value))return value.map(remap);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,k==='_ref'&&ids.has(v)?ids.get(v):remap(v)]));
  return value;
 }
 const content=docs.filter(d=>!assets.includes(d)&&!d._id.startsWith('_.'));
 let transaction=target.transaction();
 for(const doc of content){const {_rev,_createdAt,_updatedAt,...data}=doc;transaction=transaction.create(remap(data));}
 if(content.length)await transaction.commit();
 const copied=await target.fetch('*',{}, {perspective:'raw'});
 const after=signature(await source.fetch('*',{}, {perspective:'raw'}));
 if(before!==after) throw new Error('Production changed during copy; investigate concurrent edits.');
 console.log(JSON.stringify({target:targetName,contentCopied:content.length,assetsCopied:assets.length,targetDocuments:copied.length,productionUnchanged:true}));
}
main().catch(e=>{console.error('Copy failed:',e.statusCode||'',e.response?.body?.message||e.message);process.exitCode=1});
