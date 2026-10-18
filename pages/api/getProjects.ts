// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../sanity";
import { Project } from "../../typings";

const query = `
    *[_type == "project"] {
        ...,
        technologies[]->
    } | order(priority asc)
`;

type Data = {
  projects: Project[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const projects: Project[] = await sanityClient.fetch(query);

  res.status(200).json({ projects });
}
