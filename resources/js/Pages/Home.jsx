import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <Head title="Início" />
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-amber-600">
                        Sabiá Digital
                    </h1>
                    <p className="mt-3 text-lg text-gray-600">
                        Carnaíba - PE · Plataforma municipal digital
                    </p>
                </div>
            </div>
        </>
    );
}
