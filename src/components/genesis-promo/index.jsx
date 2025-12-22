import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const GenesisPromo = () => {
    return (
        <div className="relative w-full overflow-hidden my-16 rounded-2xl border border-neutral-800 bg-neutral-950/50 group hover:border-cyan-500/50 transition-colors duration-500">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-500 group-hover:opacity-50">
                <Image
                    src="/images/genesis_hackathon.png"
                    alt="Genesis Hackathon Background"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col items-start justify-center p-8 md:p-12 lg:p-16 max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-500 mb-6 border border-cyan-500/20 backdrop-blur-sm">
                    <Terminal className="h-4 w-4" />
                    <span>Coming Soon</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
                    GENESIS <span className="text-cyan-500">2026</span>
                </h2>

                <h3 className="text-xl md:text-2xl font-bold text-neutral-200 mb-6">
                    30 Hour Hackathon by QuestIT Cell
                </h3>

                <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
                    Empowering Innovation. Calling all innovators and tech enthusiasts.
                    Step into the arena where ideas meet creativity. Push your limits, build the future,
                    and leave your mark in this intense 30-hour marathon.
                </p>

                <Link href="https://genesis-hazel-one.vercel.app/" target="_blank">
                    <Button
                        size="lg"
                        className="group bg-cyan-600 hover:bg-cyan-700 text-white border-0 font-bold text-lg px-8 py-6 h-auto"
                    >
                        Explore Genesis
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
        </div>
    );
};

export default GenesisPromo;
