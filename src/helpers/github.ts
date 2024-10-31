import axios from 'axios';
import { Restaurant } from './types';



const GITHUB_USERNAME = 'fkanout';
const REPO_NAME = 'kaya-food';
const BRANCH = 'main';
const TOKEN = process.env.GITHUB_TOKEN

export const pushFileToGitHub = async (fileContent: Restaurant, fileName: string) => {
  const encodedContent = Buffer.from(JSON.stringify(fileContent, null, 2)).toString('base64');
  try {
    // Check if the file already exists to get its SHA
    let fileSha;
    try {
      const { data } = await axios.get(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/restaurants/${fileName}.json`,
        {
          headers: {
            Authorization: `token ${TOKEN}`,
          },
        }
      );
      fileSha = data.sha;
    } catch {
      //Ignore
    }
    const { data } = await axios.put(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/restaurants/${fileName}.json`,
      {
        message: `Add or update ${fileName}`,
        content: encodedContent,
        branch: BRANCH,
        sha: fileSha, // Include SHA if updating an existing file
        force: true
      },
      {
        headers: {
          Authorization: `token ${TOKEN}`,
        },
      }
    );

    console.log(`File ${fileName} committed successfully:`, data.commit.html_url);
  } catch (error) {
    console.error('Error committing file:', error);
  }

}


