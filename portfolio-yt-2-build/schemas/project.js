export default {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        { name: "technologyLabels", title: "Project skill labels", description: "When supplied, these labels replace the linked skill badges on the project card.", type: "array", of: [{ type: "string" }] },
        { name: "liveUrl", title: "Live demo URL", type: "url" },
        {
            name: "title",
            title: "Title",
            description: "Title of the Project",
            type: "string",
        },
        {
            name: "image",
            title: "Image",
            type: "image",
            options: {
                hotspot: true,
            },
        },
        {
            name: "summary",
            title: "Summary",
            type: "text",
        },
        {
            name: "technologies",
            title: "Technologies",
            type: "array",
            of: [{ type: "reference", to: { type: "skill" } }],
        },
        {
            name: "linkToBuild",
            title: "LinkToBuild",
            type: "url",
        },
        {
            name: "priority",
            title: "Priority Of Display",
            type: "number",
        }
    ],
};
