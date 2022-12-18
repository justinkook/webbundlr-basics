import "../index.css";

import React, { useState } from "react";
import Logo from "../assets/bundlr-logo.svg";
import { FaBars, FaTimes } from "react-icons/fa";
import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * @returns Top navigation bar
 */
const Navbar = () => {
	const [nav, setNav] = useState(false);
	const handleClick = () => setNav(!nav);

	return (
		<div className="fixed w-full h-[80px] flex justify-between items-center px-4 bg-primary text-text">
			<div>
				<img src={Logo} alt="Umbrella" style={{ width: "50px" }} />
			</div>
			{/* desktop menu */}
			<ul className="hidden md:flex mr-20">
				<li>
					<a
						href="/normal-uploader"
						className="hover:border-background border-2 px-4 py-2 mx-1 font-bold text-black"
						duration={500}
					>
						normal uploader
					</a>
				</li>
				<li>
					<a
						href="/large-file-uploader"
						className="hover:border-background border-2 px-4 py-2 mx-1 font-bold text-black"
						duration={500}
					>
						large file uploader
					</a>
				</li>
				<li>
					<a
						href="/lens-poster"
						className="hover:border-background border-2 px-4 py-2 mx-1 font-bold text-black"
						to=""
						offset={-100}
						duration={500}
					>
						lens poster
					</a>
				</li>
				<li>
					<a
						href="/about"
						className="hover:border-background border-2 px-4 py-2 mx-1 font-bold text-black"
						offset={-100}
						duration={500}
					>
						about
					</a>
				</li>
			</ul>

			{/* hamburger */}
			<div onClick={handleClick} className="md:hidden z-10">
				{!nav ? <FaBars /> : <FaTimes />}
			</div>
			{/* mobile menu */}
			<ul
				className={
					!nav
						? "hidden"
						: "absolute top-0 left-0 w-full h-screen bg-primary text-text flex flex-col justify-center items-center"
				}
			>
				<li className="py-6 text-4xl">
					<a href="/about" onClick={handleClick} to="about" duration={500}>
						about
					</a>
				</li>
			</ul>
			{/* social */}
			<div className="hidden"></div>
		</div>
	);
};

export default Navbar;
