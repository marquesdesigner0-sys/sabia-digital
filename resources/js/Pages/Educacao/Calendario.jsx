import { Head } from '@inertiajs/react';

const TIPO = {
    aula:    { label: 'Aula',     bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400' },
    feriado: { label: 'Feriado',  bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-400' },
    recesso: { label: 'Recesso',  bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-400' },
    evento:  { label: 'Evento',   bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-400' },
    reuniao: { label: 'Reunião',  bg: 'bg-stone-100',  text: 'text-stone-600',  dot: 'bg-stone-400' },
};

const MESES = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

function nomeMes(yyyymm) {
    const [ano, mes] = yyyymm.split('-');
    return `${MESES[parseInt(mes) - 1]} ${ano}`;
}

function formatData(dateStr, fimStr) {
    const d = new Date(dateStr + 'T12:00:00');
    const dia = d.getDate().toString().padStart(2, '0');
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    if (!fimStr || fimStr === dateStr) return `${dia}/${mes}`;
    const f = new Date(fimStr + 'T12:00:00');
    const diaF = f.getDate().toString().padStart(2, '0');
    const mesF = (f.getMonth() + 1).toString().padStart(2, '0');
    return `${dia}/${mes} até ${diaF}/${mesF}`;
}

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
                    <a key={a.href} href={a.href}
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

export default function Calendario({ eventos }) {
    const meses = Object.keys(eventos).sort();

    return (
        <>
            <Head title="Calendário escolar" />
            <div className="min-h-screen bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
                        <a href="/" className="text-stone-400 hover:text-stone-600">← Início</a>
                        <span className="text-stone-300">/</span>
                        <span className="font-semibold text-stone-800">Educação</span>
                    </div>
                </header>

                <NavEducacao ativa="/educacao/calendario" />

                <main className="mx-auto max-w-3xl px-4 py-8">
                    <div className="mb-6 flex flex-wrap gap-3">
                        {Object.entries(TIPO).map(([k, v]) => (
                            <span key={k} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${v.bg} ${v.text}`}>
                                <span className={`h-2 w-2 rounded-full ${v.dot}`} />
                                {v.label}
                            </span>
                        ))}
                    </div>

                    {meses.length === 0 ? (
                        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-stone-200">
                            <p className="text-stone-400">Nenhum evento cadastrado ainda.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {meses.map((mes) => (
                                <div key={mes}>
                                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                                        {nomeMes(mes)}
                                    </h2>
                                    <div className="space-y-2">
                                        {eventos[mes].map((ev) => {
                                            const t = TIPO[ev.tipo] ?? TIPO.evento;
                                            return (
                                                <div
                                                    key={ev.id}
                                                    className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200"
                                                >
                                                    <span className={`mt-0.5 h-3 w-3 shrink-0 rounded-full ${t.dot}`} />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="font-medium text-stone-800">{ev.titulo}</p>
                                                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${t.bg} ${t.text}`}>
                                                                {t.label}
                                                            </span>
                                                        </div>
                                                        <p className="mt-0.5 text-xs text-stone-500">
                                                            {formatData(ev.data_inicio, ev.data_fim)}
                                                        </p>
                                                        {ev.descricao && (
                                                            <p className="mt-1 text-sm text-stone-500">{ev.descricao}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
