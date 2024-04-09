import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { scrollSepolia } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

const projectId = process.env.REACT_APP_WAGMI_PROJECT_ID || "YOUR_PROJECT_ID";

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "http://localhost:5173/" || "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [scrollSepolia] as const;

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  // ...wagmiOptions // Optional - Override createConfig parameters
});
