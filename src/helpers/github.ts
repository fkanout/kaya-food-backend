import simpleGit, { SimpleGit } from 'simple-git';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const REMOTE_NAME = 'new-remote';
const GITHUB_PAGES_URL = `https://${process.env.GITHUB_TOKEN}@github.com/fkanout/kaya-food.git`;
const git: SimpleGit = simpleGit();

async function setupRemoteWithSingleFile(
  jsonData: Record<string, any>,
  fileName: string,
  commitMessage: string,
  branch: string = 'gh-pages'
): Promise<void> {
  try {
    const filePath = path.join(__dirname, fileName);
    const scriptFilePath = path.join(__dirname, "github.ts");
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

    // Remove any existing remote with the same name
    const remotes = await git.getRemotes();
    if (remotes.some(remote => remote.name === REMOTE_NAME)) {
      await git.removeRemote(REMOTE_NAME);
    }

    // Add the new remote with the updated name
    await git.addRemote(REMOTE_NAME, GITHUB_PAGES_URL);
    console.log(`Remote ${REMOTE_NAME} added for ${GITHUB_PAGES_URL}`);

    // Fetch branches from the remote to check if the branch already exists
    await git.fetch(REMOTE_NAME);
    const remoteBranches = await git.branch(['-r']);
    const branchExists = remoteBranches.all.includes(`${REMOTE_NAME}/${branch}`);

    if (!branchExists) {
      // Create an orphan branch if it doesn’t exist remotely
      await git.checkout(['--orphan', branch]);
      console.log(`Orphan branch ${branch} created`);

      // Remove all existing files from the staging area in the orphan branch
      await git.raw(['rm', '-rf', '.']); // Ensure this removes all files

      // Confirm all files are removed
      const status = await git.status();
      if (status.files.length === 0) {
        console.log('All files successfully removed from the orphan branch.');
      } else {
        console.log('Files still present:', status.files);
      }

      // Stage and commit only the specified file
      await git.add(filePath);
      await git.add(scriptFilePath);
      await git.commit(commitMessage);

      // Force push only this branch with the single file to the new remote
      await git.push(['-u', REMOTE_NAME, branch, '--force']);

      console.log(`File ${fileName} committed and pushed to ${REMOTE_NAME} on branch ${branch}`);
    } else {
      console.log(`Branch ${branch} already exists on remote ${REMOTE_NAME}.`);
    }

    // Clean up the temporary file if necessary
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error pushing single JSON file to new remote:', error);
  }
}

// Example JSON data to push as a single file
const jsonData = {
  message: "Hello, GitHub Pages!",
  timestamp: new Date().toISOString()
};

// Call the function to set up the remote and push the single file
setupRemoteWithSingleFile(jsonData, 'data.json', 'Add data.json with in-memory JSON content');
