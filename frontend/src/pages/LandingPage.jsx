import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function LandingPage() {
    const [open, setOpen] = useState(false);

    const cards = [
        "/cards/one.jpg",
        "/cards/two.jpg",
        "/cards/three.jpg",
        "/cards/four.jpg",
        "/cards/five.jpg",
        "/cards/six.jpg",
        "/cards/seven.jpg"
    ];

    const logos = [
        "/partners/partner1.jpg",
        "/partners/partner2.jpg",
        "/partners/partner3.jpg",
        "/partners/partner4.jpg",
        "/partners/partner5.jpg",
        "/partners/partner6.jpg",
    ];

    useEffect(() => {
        const nav = document.getElementById("navbar");
        const handleScroll = () => {
            if (window.scrollY > 50) {
                nav.style.backgroundColor = "#0a133d";
            } else {
                nav.style.backgroundColor = "";
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen font-sans text-gray-900">

            {/* NAVBAR */}
            <header className="fixed top-0 left-0 w-full z-50 text-white" id="navbar">
                <div className="flex justify-between items-center px-6 md:px-10 py-4">
                    <h1 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Zune
                    </h1>

                    <div className="hidden md:flex gap-8 text-sm">
                        <span className="cursor-pointer">Products</span>
                        <span className="cursor-pointer">Solutions</span>
                        <span className="cursor-pointer">Pricing</span>
                    </div>

                    <button className="hidden md:block px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-white hover:text-blue-600 transition">
                        <Link to="/auth">
                            Sign Up</Link>
                    </button>

                    <div className="md:hidden cursor-pointer" onClick={() => setOpen(!open)}>
                        <div className={`w-6 h-0.5 bg-white mb-1 transition ${open && 'rotate-45 translate-y-1.5'}`} />
                        <div className={`w-6 h-0.5 bg-white mb-1 transition ${open && 'opacity-0'}`} />
                        <div className={`w-6 h-0.5 bg-white transition ${open && '-rotate-45 -translate-y-1.5'}`} />
                    </div>
                </div>

                {open && (
                    <div className="md:hidden px-6 pb-6 space-y-4" style={{ backgroundColor: "#1a2252" }}>
                        <p>Products</p>
                        <p>Solutions</p>
                        <p>Pricing</p>
                        <button className="px-5 py-2 rounded-md bg-blue-600 text-white">
                            <Link to="/auth">
                            Sign Up</Link>
                        </button>
                    </div>
                )}
            </header>

            {/* HERO */}
            <section
                className="pt-32 pb-20 text-center px-6"
                style={{ background: "linear-gradient(to bottom, #08123b, #8582dd, #ffffff)" }}
            >
                <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6 max-w-4xl mx-auto">
                    Everything you need to communicate in one place
                </h2>

                <p className="text-gray-200 text-base md:text-lg max-w-2xl mx-auto mb-10">
                    Zune combines video conferencing, chat, and screen sharing into a seamless experience designed for modern teams.
                </p>

                <button className="w-1/2 sm:w-1/3 mx-auto px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-white hover:text-blue-600 transition flex flex-row justify-center items-center">
                <Link to="/auth">
                    Get Started <ArrowUpRight className="inline" /></Link>
                </button>

                <div className="overflow-hidden mt-16 py-10">
                    <div className="flex gap-6 marquee-track">
                        {[...cards, ...cards, ...cards].map((src, i) => (
                            <div key={i} className="min-w-[220px] md:min-w-[260px] h-[200px] md:h-[260px] rounded-2xl overflow-hidden shadow-md transform transition duration-300 hover:-translate-y-4">
                                <img src={src} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SPLIT SECTION */}
            <section className="px-6 md:px-10 py-20 bg-white">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-center items-center gap-2">
                    <div className="w-full xl:w-1/2 flex flex-col justify-center items-center">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Endless ways to collaborate</h2>
                        <p className="text-gray-600 text-sm mb-6">
                            Zune adapts to your workflow, whether you're hosting meetings, brainstorming ideas, or collaborating across teams. Designed for simplicity and speed, it ensures communication never slows you down.
                        </p>
                        <ul className="space-y-3 text-gray-600 text-sm list-disc pl-5 md:pl-0">
                            <li>Join meetings instantly without setup delays or complicated links.</li>
                            <li>Real-time messaging to keep conversations flowing across your team.</li>
                            <li>Seamless screen sharing for presentations, demos, and collaboration.</li>
                            <li>Reliable performance with stable connections even on low bandwidth.</li>
                            <li>Secure communication with end-to-end encryption and privacy controls.</li>
                            <li>Cross-platform access across desktop, mobile, and browser.</li>
                            <li>Easy participant management with controls for hosts and teams.</li>
                            <li>High-quality audio and video for a smooth meeting experience.</li>
                        </ul>
                        <button className="w-1/2 md:w-1/4 mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-white hover:text-blue-600 border border-blue-600 transition flex flex-row justify-center items-center">Explore More <ArrowUpRight /></button>
                    </div>
                    <div className="w-[90%] xl:w-1/2 mt-10 lg:mt-0 h-[260px] md:h-[320px] bg-gray-200 rounded-2xl bg-[url(/image1.webp)] bg-cover" />
                </div>
            </section>

            {/* REPORT SECTION */}
            <section className="px-6 md:px-10 py-20 bg-white">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">

                    <div className="w-[90%] mt-10 md:mt-0 space-y-4 transform transition duration-300 hover:-translate-y-4 mx-auto">
                        <div className="h-[200px] rounded-2xl bg-blue-900 text-white p-6 flex items-end bg-[url(/cards/eight.jpg)] bg-cover">
                            <p className="text-lg font-semibold">High-performance video meetings</p>
                        </div>
                        <p className="text-gray-600 text-sm">Experience ultra-low latency video calls with crystal clear quality, built to scale for teams of any size.</p>
                        <button className="w-1/4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-white hover:text-blue-600 border border-blue-600 transition text-sm flex flex-row justify-center items-center">Explore <ArrowUpRight /></button>
                    </div>

                    <div className="w-[90%] mt-10 md:mt-0 space-y-4 transform transition duration-300 hover:-translate-y-4 mx-auto">
                        <div className="h-[200px] rounded-2xl bg-blue-900 text-white p-6 flex items-end bg-[url(/cards/nine.jpg)] bg-cover">
                            <p className="text-lg font-semibold">Seamless team communication</p>
                        </div>
                        <p className="text-gray-600 text-sm">Keep conversations flowing with real-time chat, and persistent team discussions.</p>
                        <button className="w-1/4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-white hover:text-blue-600 border border-blue-600 transition text-sm flex flex-row justify-center items-center">Explore <ArrowUpRight /></button>
                    </div>

                    <div className="w-[90%] mt-10 md:mt-0 space-y-4 transform transition duration-300 hover:-translate-y-4 mx-auto">
                        <div className="h-[200px] rounded-2xl bg-blue-900 text-white p-6 flex items-end bg-[url(/cards/ten.jpg)] bg-cover">
                            <p className="text-lg font-semibold">Effortless screen sharing</p>
                        </div>
                        <p className="text-gray-600 text-sm">Present, collaborate, and demonstrate ideas in real time with smooth and reliable screen sharing.</p>
                        <button className="w-1/4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-white hover:text-blue-600 border border-blue-600 transition text-sm flex flex-row justify-center items-center">Explore <ArrowUpRight /></button>
                    </div>

                </div>
            </section>

            {/* TRUSTED */}
            <section className="px-10 md:px-0 text-center py-20 bg-white">
                <h2 className="text-gray-600 text-2xl md:text-3xl font-semibold mb-4">Trusted by teams worldwide</h2>
                <div className="flex flex-wrap justify-center gap-10 mt-5">
                    {logos.map((src, i) => (
                        <img key={i} src={src} className="w-1/3 md:w-1/7 lg:w-1/14 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition" />
                    ))}
                </div>
            </section>

            {/* REVIEWS */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-semibold mb-10">Loved by users</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">

                        <div className="w-[90%] mt-10 md:mt-0 p-6 bg-gray-50 rounded-xl shadow-sm flex flex-col justify-center items-center mx-auto">
                            <div className="size-15 md:size-24 rounded-full bg-conic-180 from-indigo-600 via-indigo-50 to-indigo-600"></div>
                            <p className="text-yellow-500 mb-3">★★★★</p>
                            <p className="text-sm text-gray-600">Zune completely transformed how our remote team communicates. The video quality and chat integration are flawless.</p>
                            <p className="mt-4 text-sm font-medium">Amit Sharma</p>
                        </div>

                        <div className="w-[90%] mt-10 md:mt-0 p-6 bg-gray-50 rounded-xl shadow-sm flex flex-col justify-center items-center mx-auto">
                            <div className="size-15 md:size-24 rounded-full bg-conic from-blue-600 to-sky-400 to-50%"></div>
                            <p className="text-yellow-500 mb-3">★★★★★</p>
                            <p className="text-sm text-gray-600">We switched from multiple tools to Zune and everything just works better. Meetings and collaboration feel effortless now.</p>
                            <p className="mt-4 text-sm font-medium">Sarah Johnson</p>
                        </div>

                        <div className="w-[90%] mt-10 md:mt-0 p-6 bg-gray-50 rounded-xl shadow-sm flex flex-col justify-center items-center mx-auto">
                            <div className="size-15 md:size-24 rounded-full bg-conic-180 from-teal-600 via-indigo-50 to-teal-600"></div>
                            <p className="text-yellow-500 mb-3">★★★★</p>
                            <p className="text-sm text-gray-600">The simplicity and performance of Zune is unmatched. Screen sharing is smooth and reliable every single time.</p>
                            <p className="mt-4 text-sm font-medium">Rahul Verma</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="text-white px-6 md:px-10 py-16" style={{ background: "linear-gradient(to bottom, #000327, #000327)" }}>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 text-sm">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Zune
                        </h1>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold">About</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>zune Blog</li>
                            <li>Customers</li>
                            <li>Our Team</li>
                            <li>Careers</li>
                            <li>Integrations</li>
                            <li>Partners</li>
                            <li>Investors</li>
                            <li>Press</li>
                            <li>Sustainability & ESG</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold">Download</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>zune Workplace App</li>
                            <li>zune Rooms App</li>
                            <li>Browser Extension</li>
                            <li>Outlook Plug-in</li>
                            <li>iPhone/iPad App</li>
                            <li>Android App</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold">Sales</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>Contact Sales</li>
                            <li>Plans & Pricing</li>
                            <li>Request a Demo</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>Account</li>
                            <li>Support Center</li>
                            <li>Learning Center</li>
                            <li>Community</li>
                            <li>Feedback</li>
                            <li>Contact Us</li>
                            <li>Accessibility</li>
                        </ul>
                    </div>

                </div>

                <div className="text-center text-gray-500 mt-10 text-sm">
                    © {new Date().getFullYear()} Zune. All rights reserved.
                </div>
            </footer>

            <style>{`
        .marquee-track {
          width: max-content;
          display: flex;
          animation: scroll 20s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
        </div>
    );
}
