import { useRouter } from "next/router";
import { FaustProvider } from "@faustwp/core";
import { WordPressBlocksProvider } from "@faustwp/blocks";
import blocks from "../wp-blocks";
import "../faust.config.js";

/**
 * TODO: Export these (↓) into WP
 */
import "@/styles/globals.css";
import "@/styles/modules.css";
 
export default function App({ Component, pageProps }) {
	const router = useRouter();

	return (
		<FaustProvider pageProps={pageProps}>
			<WordPressBlocksProvider config={blocks}>
				<Component {...pageProps} key={router.asPath} />
			</WordPressBlocksProvider>
		</FaustProvider>
	);
}