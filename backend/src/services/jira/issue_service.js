import { jiraClient as client } from "./jiraClient.js";

export const printProjects = async () => {
    try {
        const { values: projects } = await client.projects.searchProjects();
        console.log("Jira Projects:");
        projects.forEach((project) => {
            console.log(`- ${project.name} (Key: ${project.key})`);
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
};

printProjects();
