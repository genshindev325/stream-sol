import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { Transaction, PublicKey } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  getAssociatedTokenAddressSync,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  Account,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";
import { SOL_MEDIA_MINT } from "@/libs/constants";
import { AvatarComponent, FullLoading } from "../common";

export default function DonateModal({
  pk,
  name,
  username,
  avatar,
  onClose,
}: {
  pk: string;
  name: string;
  username: string;
  avatar: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const donate = async () => {
    if (!pk || !publicKey) {
      return;
    }

    if (!amount) {
      return;
    }

    const numAmount = parseFloat(amount);
    const realAmount = Math.floor(numAmount);

    if (realAmount <= 0) {
      return;
    }

    const fromAssociatedTokenAddress = getAssociatedTokenAddressSync(
      SOL_MEDIA_MINT,
      publicKey
    );

    const toAssociatedTokenAddress = getAssociatedTokenAddressSync(
      SOL_MEDIA_MINT,
      new PublicKey(pk)
    );

    let toAccount: Account;
    let hasAta = true;
    setLoading(true);
    try {
      toAccount = await getAccount(connection, toAssociatedTokenAddress);
    } catch (error: unknown) {
      if (
        error instanceof TokenAccountNotFoundError ||
        error instanceof TokenInvalidAccountOwnerError
      ) {
        hasAta = false;
      } else {
        toast.error("Failed to donate", { duration: 3000 });
        setLoading(false);
        return;
      }
    }

    try {
      const tx = new Transaction();

      const donateAmount = BigInt(realAmount) * BigInt("1000000");

      if (!hasAta) {
        tx.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            toAssociatedTokenAddress,
            new PublicKey(pk),
            SOL_MEDIA_MINT
          )
        );
      }
      tx.add(
        createTransferInstruction(
          fromAssociatedTokenAddress,
          toAssociatedTokenAddress,
          publicKey,
          donateAmount
        )
      );

      const signature = await sendTransaction(tx, connection);

      const response = await connection.confirmTransaction(
        signature,
        "confirmed"
      );

      toast.success("Successfully donated", { duration: 3000 });
    } catch (err) {
      toast.error("Failed to donate", { duration: 3000 });
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-30 bg-[#00000080]">
      {loading && (
        <FullLoading />
      )}
      <div className="flex flex-col items-center gap-[16px] w-[320px] sm:w-[400px] modal-center bg-modal rounded-lg p-4 sm:p-6">
        <MdClose
          size={24}
          className="absolute right-[16px] top-[16px] hover:cursor-pointer"
          onClick={() => {
            if (!loading) {
              onClose();
            }
          }}
        />

        <div className="text-[1.25rem] sm:text-[1.5rem] font-bold">
          Donate to Creator
        </div>

        <div className="flex items-center gap-4">
          <AvatarComponent avatar={avatar} size={60} />
          <div className="flex-1">
            <div className="text-[1rem] sm:text-[1.25rem]">{name}</div>
            <div className="text-[0.75rem] sm:text-[0.875rem] text-grey-500">
              @{username}
            </div>
          </div>
        </div>

        <div className="border border-solid border-grey-800 rounded-lg mt-2 px-2">
          <input
            type="text"
            spellCheck={false}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            placeholder="Enter $MEDIA Amount"
            disabled={loading}
            className="text-white h-[44px] text-[0.875rem] sm:text-[1rem] bg-transparent border-none focus:outline-none focus:box-shadow:none"
          />
        </div>

        <div className="flex justify-end gap-[16px] mt-[16px]">
          <div
            className="w-[120px] lg:w-[140px] h-[36px] lg:h-[44px] text-[0.875rem] lg:text-[1rem] border border-solid border-grey-800 rounded-lg flex justify-center items-center hover:cursor-pointer font-semibold"
            onClick={() => {
              if (!loading) {
                window.open(
                  "https://jup.ag/swap/SOL-MEDIA_BNT4uhSStq1beFADv3cq4wQAVfWB392PjAaxTBpNeWxu",
                  "_blank"
                );
              }
            }}
          >
            Buy $MEDIA
          </div>
          <div
            className="bg-primary-300 w-[120px] lg:w-[140px] h-[36px] lg:h-[44px] text-[0.875rem] lg:text-[1rem] rounded-lg flex justify-center items-center hover:cursor-pointer font-semibold"
            onClick={() => {
              if (!loading) {
                donate();
              }
            }}
          >
            Send Donation
          </div>
        </div>
      </div>
    </div>
  );
}