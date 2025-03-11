import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-8 overflow-hidden shadow-lg">
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,183,255,0.15)_10%,transparent_70%)] opacity-50"></div>

            {/* Top border glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-500/40 via-blue-500/10 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            VerCert
                        </h3>
                        <p className="text-gray-300 max-w-xs">
                            Secure, verifiable credentials powered by blockchain
                            technology.
                        </p>
                        <p className="text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} VerCert. All
                            rights reserved.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-100">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {[
                                "Home",
                                "Issue",
                                "Verify",
                                "About",
                            ].map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={
                                            index === 0
                                                ? "/"
                                                : `/${item
                                                      .toLowerCase()
                                                      .replace(/ /g, "-")}`
                                        }
                                        className="group relative text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                                    >
                                        <span>{item}</span>
                                        {/* Animated underline effect */}
                                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-100">
                            Connect With Us
                        </h3>
                        <div className="flex space-x-4">
                            {/* LinkedIn */}
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                            >
                                <span className="sr-only">LinkedIn</span>
                                <div className="relative overflow-hidden w-5 h-5">
                                    <img
                                        src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/linkedin.svg"
                                        alt="LinkedIn"
                                        className="w-full h-full absolute invert transition-all duration-300"
                                    />
                                </div>
                            </a>

                            {/* GitHub */}
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                            >
                                <span className="sr-only">GitHub</span>
                                <div className="relative overflow-hidden w-5 h-5">
                                    <img
                                        src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/github.svg"
                                        alt="GitHub"
                                        className="w-full h-full absolute invert group-hover:invert-0 transition-all duration-300"
                                        style={{
                                            filter: "brightness(0) invert(1)",
                                        }}
                                    />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
