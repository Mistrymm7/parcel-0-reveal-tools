import { writeDataToFile } from '../../services/files';
import { fetchAllNFTOwners } from '../../services/moralis';
import { print } from '../commands/cmd';

export const fetchNFTOwners = async (address: string, outputFile: string) => {
  print(`Fetching NFT ${address} data into '${outputFile}'...`);

  const results = await fetchAllNFTOwners(address);
  await writeDataToFile(results, outputFile);

  print('Done.');
};
