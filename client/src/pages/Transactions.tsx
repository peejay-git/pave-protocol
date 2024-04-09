import { FC, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { UserAccountDataAbi, UserAccountDataAddress } from "@/abi";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatEther } from "viem";
import { useToast } from "@/components/ui/use-toast";


const Transactions: FC = () => {
  const { address } = useAccount();
  const { toast } = useToast();

  const { data: unknownData, error } = useReadContract({
    abi: UserAccountDataAbi,
    address: UserAccountDataAddress,
    functionName: "getTransactions",
    args: [address],
  });

  const data = unknownData as {
    user: string;
    amount: bigint;
    tokenName: string;
    transactionType: string;
    timestamp: bigint;
  }[];

  useEffect(() => {
    if(error) {
      toast({
      title: "Error",
      description: error.message,
    });
  }
  }, [error]);

  return (
    <div className=" h-screen ">
      {!data?.length ? (
        <div className="flex flex-col items-center gap-5 h-full justify-center md:gap-10">
          <Trash2 size={100} className=" text-home_gradient" />
          <p className=" font-Jakarta text-home_gradient font-medium text-base md:text-2xl  text-center">
            No transaction record found
          </p>
        </div>
      ) : (
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((tx, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {tx.transactionType.charAt(0).toUpperCase() +
                    tx.transactionType.slice(1)}
                </TableCell>
                <TableCell>
                  {new Date(Number(tx.timestamp) * 1000).toLocaleString()}
                </TableCell>
                <TableCell>
                  {tx.tokenName}
                </TableCell>
                <TableCell className="text-right">
                  {formatEther(tx.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Transactions;
