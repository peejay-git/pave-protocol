import { Coins } from "lucide-react";
import { FC, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "./ui/input";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { LendingPoolAbi, LendingPollAddress, UsdcAbi, UsdcAddress } from "@/abi";
import { parseEther } from "viem";
import Loading from "./Loading";
// import { Label } from "./ui/label";
// import { Checkbox } from "./ui/checkbox";

interface DataCardProps {
  name: string;
  amount: string;
  type: "supply" | "borrow";
}
const DataCard: FC<DataCardProps> = ({ name, amount, type }) => {
  const [value, setValue] = useState<number | string>(0);
  const { toast } = useToast();
  const { isPending, writeContract } = useWriteContract();

  
  const [withdrawHash, setWithdrawHash] = useState<`0x${string}`>();
  const [approveRepayHash, setAppproveRepayHash] = useState<`0x${string}`>();
  const [repayHash, setRepayHash] = useState<`0x${string}`>();
  
  const { isLoading: withdrawLoading, isSuccess: withdrawConfirmed } =
  useWaitForTransactionReceipt({
    hash: withdrawHash,
  });
  const { isLoading: approveRepayLoading, isSuccess: approveRepayConfirmed } =
  useWaitForTransactionReceipt({
    hash: approveRepayHash,
  });
  const { isLoading: repayLoading, isSuccess: repayConfirmed } =
  useWaitForTransactionReceipt({
    hash: repayHash,
  });

  function handleWithdraw() {

    writeContract(
      {
        abi: LendingPoolAbi,
        address: LendingPollAddress,
        functionName: "withdraw",
        args: [parseEther(`${value}`)],
      },
      {
        onSuccess: (data) => {
          // console.log(data);
          setWithdrawHash(data)
         

        },
        onError: (err) => {
          console.log(err.message);
          toast({
            title: "Error",
            description: err.message,
          });
        },
      }
    );

  }
  function handleRepay() {
    writeContract(
      {
        abi: UsdcAbi,
        address: UsdcAddress,
        functionName: "approve",
        args: [LendingPollAddress, parseEther(`${value}`)],
      },
      {
        onSuccess: (data) => {
          // console.log(data);
          setAppproveRepayHash(data)
          
        },
        onError: (err) => {
          console.log(err.message);
          toast({
            title: "Error",
            description: err.message,
          });
        },
      }
    );
  }

  useEffect(() => {
    if(withdrawConfirmed) {
      toast({
        title: "Success",
        description:
          `You withdrawal of ${value} was submitted successfully`,
      });
    }
  }, [withdrawConfirmed])


  useEffect(() => {
    if(approveRepayConfirmed) {
      writeContract(
        {
          abi: LendingPoolAbi,
          address: LendingPollAddress,
          functionName: "repay",
          args: [parseEther(`${value}`)],
        },
        {
          onSuccess: (data) => {
            setRepayHash(data);
            
          },
          onError: (err) => {
            console.log(err.message);
            toast({
              title: "Error",
              description: err.message,
            });
          },
        }
      );
    }
  }, [approveRepayConfirmed])


  useEffect(() => {
    if(repayConfirmed) {
      toast({
        title: "Success",
        description:
          `You repay of ${value} was successful`,
      });

    }
  }, [repayConfirmed])





  if (isPending || withdrawLoading || approveRepayLoading || repayLoading) return <Loading loading={isPending || withdrawLoading || approveRepayLoading || repayLoading} />;

  return (
    <div className="flex items-center justify-between">
      <Coins className="w-8 h-8 text-dark_green" />
      <p className=" font-Jakarta text-dark_green text-base">{name}</p>
      <p className=" font-Jakarta text-dark_green/70 text-base">{amount}</p>
      <Dialog>
        <DialogTrigger>
          <Button className=" bg-primary_blue/70 hover:bg-primary_blue  text-white text-sm">
            {type === "supply" ? "Withdraw" : "Repay"}
          </Button>
        </DialogTrigger>
        <DialogContent className=" flex flex-col gap-10">
          <p className="text-dark_green font-Jakarta font-semibold text-xl">
            {type === "supply"
              ? " Withdraw collateral"
              : "Repay borrowed asset"}
          </p>
          <div className=" bg-white border border-dark_green flex gap-2 justify-between w-full rounded-lg p-2 items-center">
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.valueAsNumber)}
              placeholder="0.00"
              className=" flex-1 text-lg leading-10 border-none focus-visible:ring-transparent text-dark_green font-Jakarta font-medium ring-transparent no-spinners"
            />
            <div className="flex gap-1 flex-col">
            <div className="flex gap-1 flex-col">

<div className="w-fit flex gap-2 border-none text-primary_blue outline-none focus:ring-transparent focus-visible:ring-transparent focus-visible:outline-none font-Jakarta font-bold text-lg">
<Coins className="w-6 h-6 text-dark_gree text-primary_blue" />
{
  type === "supply" ? (
    <p>PAPCoin</p>
  ) : (
    <p >PAPUSDC</p>

  )
}

</div>
<div className="flex gap-2 justify-between items-center">
                  <p className="text-dark_green text-sm">
                   {
                    type === "supply" ? "Collateral" : "Borrowed" 
                   } : {amount}
                  </p>
                  <p
                    onClick={() => {
                     setValue(amount)
                    }}
                    className="text-dark_green/50 hover:text-dark_green hover:font- text-sm cursor-pointer"
                  >
                    MAX
                  </p>
                </div>
            </div>
          </div>

          </div>
        
          <Button
           disabled={value === 0 || value === "0" || value === ""}
           onClick={() => {
             type === "supply" ? handleWithdraw() : handleRepay();
           }}
           className="w-full bg-primary_blue hover:bg-primary_blue text-white font-Jakarta font-bold text-lg py-2 rounded-lg">
            {type === "supply" ? "Withdraw" : "Repay"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataCard;
