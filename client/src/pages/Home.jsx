import { useEffect, useState } from 'react';
import { Api } from '../services/api';
import ProductCard from '../components/ProductCard';


export default function Home() {
const [list, setList] = useState([]);
const [loading, setLoading] = useState(true);


useEffect(() => {
Api.products()
.then(setList)
.finally(() => setLoading(false));
}, []);


if (loading) return <p>Carregando…</p>;


return (
<div style={{ padding: 24 }}>
<h2>Catálogo</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
{list.map((p) => (
<ProductCard key={p.id} product={p} />)
)}
</div>
</div>
);
}