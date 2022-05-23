import { Connection, ParsedInstruction, PublicKey, Cluster, clusterApiUrl, PartiallyDecodedInstruction } from '@solana/web3.js';

export const TOKEN_PROGRAM_ID: PublicKey = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

function isPartiallyDecoded(
  instruction: ParsedInstruction | PartiallyDecodedInstruction
): instruction is PartiallyDecodedInstruction {
  return (instruction as PartiallyDecodedInstruction).accounts !== undefined;
}

export class Solana {
  network: string;
  connection: Connection = {} as Connection;

  constructor(network: string) {
    this.network = network;
  }

  connect(): void {
    const apiUrl = clusterApiUrl(this.network as Cluster);
    this.connection = new Connection(apiUrl, 'confirmed');
  }

  /// @throws (Error)
  async querySignature(signature: string) {
    if (this.connection) {
      const txList = await this.connection.getParsedTransactions([signature], 'confirmed');
      if (txList) {
        for (const tx of txList) {
          if (tx) {
            for (const instruction of tx.transaction.message.instructions) {
              console.log(instruction.programId.toBase58());
              if (isPartiallyDecoded(instruction)) {
                const partialInstruction = <PartiallyDecodedInstruction>instruction;
                for (const acc of partialInstruction.accounts) {
                  console.log(acc.toBase58());
                }
              } else {
                const parsedInstruction = <ParsedInstruction>instruction;
                console.log(parsedInstruction.parsed?.type);
                if (
                  parsedInstruction.parsed?.type === 'create' &&
                  instruction.programId.toBase58() === ASSOCIATED_TOKEN_PROGRAM_ID.toBase58()
                ) {
                  const info = parsedInstruction.parsed?.info;
                  console.log(`account: ${info.account}`);
                  console.log(`mint: ${info.mint}`);
                  console.log(`source: ${info.source}`);
                  console.log(`wallet: ${info.wallet}`);
                } else if (
                  parsedInstruction.parsed?.type === 'transferChecked' &&
                  instruction.programId.toBase58() === TOKEN_PROGRAM_ID.toBase58()
                ) {
                  const info = parsedInstruction.parsed?.info;
                  console.log(`authority: ${info.authority}`);
                  console.log(`mint: ${info.mint}`);
                  console.log(`destination: ${info.destination}`);
                  console.log(`source: ${info.source}`);
                }
              }
            }
          }
        }
      }
    } else {
      throw new Error('Not connected');
    }
  }
}
