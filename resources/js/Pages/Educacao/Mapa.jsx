import { Head } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

const ICONE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
  <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24s16-14 16-24C32 7.163 24.837 0 16 0z" fill="#D97706"/>
  <circle cx="16" cy="16" r="7" fill="white"/>
</svg>
`;

function NavEducacao({ ativa }) {
    const abas = [
        { href: '/educacao',                   label: 'Escolas' },
        { href: '/educacao/mapa',              label: 'Mapa' },
        { href: '/educacao/calendario',        label: 'Calendário' },
        { href: '/educacao/minhas-matriculas', label: 'Minhas matrículas' },
    ];
    return (
        <div className="flex gap-1 border-b border-stone-200 bg-white px-4">
            <div className="mx-auto flex w-full max-w-3xl gap-1">
                {abas.map((a) => (
                    <a
                        key={a.href}
                        href={a.href}
                        className={`border-b-2 px-3 py-3 text-sm font-medium transition ${
                            a.href === ativa
                                ? 'border-amber-500 text-amber-600'
                                : 'border-transparent text-stone-500 hover:text-stone-800'
                        }`}
                    >
                        {a.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default function Mapa({ escolas }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    const escolasComCoordenadas = escolas.filter((e) => e.latitude && e.longitude);

    useEffect(() => {
        if (mapInstance.current) return;

        import('leaflet').then((L) => {
            // Corrige ícones padrão do Leaflet com Vite
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            const icone = L.divIcon({
                html: ICONE_SVG,
                className: '',
                iconSize: [32, 40],
                iconAnchor: [16, 40],
                popupAnchor: [0, -40],
            });

            // Centro em Carnaíba-PE
            const centro = escolasComCoordenadas.length
                ? [escolasComCoordenadas[0].latitude, escolasComCoordenadas[0].longitude]
                : [-7.8021, -37.7991];

            mapInstance.current = L.map(mapRef.current).setView(centro, 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(mapInstance.current);

            escolasComCoordenadas.forEach((escola) => {
                const vagasLivres = escola.total_vagas - escola.vagas_ocupadas;
                const vagasTexto = escola.total_vagas > 0
                    ? `<span style="color:${vagasLivres > 0 ? '#16a34a' : '#dc2626'};font-weight:600">${vagasLivres > 0 ? vagasLivres + ' vagas disponíveis' : 'Sem vagas'}</span>`
                    : 'Vagas não informadas';

                L.marker([escola.latitude, escola.longitude], { icon: icone })
                    .addTo(mapInstance.current)
                    .bindPopup(`
                        <div style="min-width:180px;font-family:sans-serif">
                            <p style="font-weight:700;font-size:14px;margin:0 0 4px">${escola.nome}</p>
                            <p style="font-size:12px;color:#78716c;margin:0 0 6px">${escola.endereco}</p>
                            <p style="font-size:12px;margin:0 0 8px">${vagasTexto}</p>
                            <div style="display:flex;gap:6px">
                                <a href="/educacao/vagas/${escola.id}" style="font-size:12px;color:#d97706;text-decoration:none;font-weight:500">Ver vagas</a>
                                <span style="color:#d1d5db">·</span>
                                <a href="/educacao/matricula/${escola.id}" style="font-size:12px;color:#d97706;text-decoration:none;font-weight:500">Matricular</a>
                            </div>
                        </div>
                    `);
            });

            // Ajusta zoom para mostrar todas as escolas
            if (escolasComCoordenadas.length > 1) {
                const bounds = L.latLngBounds(escolasComCoordenadas.map((e) => [e.latitude, e.longitude]));
                mapInstance.current.fitBounds(bounds, { padding: [40, 40] });
            }
        });

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    return (
        <>
            <Head title="Mapa das escolas" />
            <div className="flex min-h-screen flex-col bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
                        <a href="/" className="text-stone-400 hover:text-stone-600">← Início</a>
                        <span className="text-stone-300">/</span>
                        <span className="font-semibold text-stone-800">Educação</span>
                    </div>
                </header>

                <NavEducacao ativa="/educacao/mapa" />

                <div className="flex flex-1 flex-col">
                    {escolasComCoordenadas.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center">
                            <p className="text-stone-400">Nenhuma escola com localização cadastrada.</p>
                        </div>
                    ) : (
                        <>
                            {/* Legenda */}
                            <div className="mx-auto w-full max-w-3xl px-4 py-3">
                                <div className="flex flex-wrap gap-2">
                                    {escolasComCoordenadas.map((e) => (
                                        <span
                                            key={e.id}
                                            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-sm ring-1 ring-stone-200"
                                        >
                                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                                            {e.nome}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Mapa */}
                            <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-6">
                                <div
                                    ref={mapRef}
                                    className="h-[480px] w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-stone-200"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
