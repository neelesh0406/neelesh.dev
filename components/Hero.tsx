import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import { PageInfo } from '../typings';
import BackgroundCircles from './BackgroundCircles';
const PhoneHero=dynamic(()=>import('./PhoneHero'),{ssr:false,loading:()=> <div className="phone-loading"><img src="/phone/cover.svg" alt="Neelesh Chandwani"/><span>Preparing the folding phone…</span></div>});
export default function Hero({pageInfo}:{pageInfo:PageInfo}){
 const [text]=useTypewriter({words:[`Hi, I'm ${pageInfo?.name || 'Neelesh Chandwani'}`,'Guy-who-loves-Chai.tsx','<LovesToRead />'],loop:true,delaySpeed:2000});
 return <div className="phone-hero-sticky"><BackgroundCircles/><div className="phone-hero-content"><h2 className="text-sm uppercase text-gray-500 tracking-[5px]">Senior Frontend Engineer</h2><PhoneHero/><h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold px-4"><span className="mr-3">{text}</span><Cursor cursorColor="#F7AB0A"/></h1><div className="pt-4">{['about','experience','skills','projects'].map(id=><Link className="heroButton" href={`#${id}`} key={id}>{id}</Link>)}</div></div></div>;
}
