// Viegls front-end bez servera. Demo dati lokāli.

const SAMPLE_PRODUCTS = [
  {id:'p1',name:'Ilgnoturīgais Tonālais X',type:'Tonālie krēmi',skin:['jaukti','sausai'],price:'mid',feat:['long'],brand:'Brand A',rating:4.5},
  {id:'p2',name:'Krāsa Lūpām Velvet',type:'Lūpu krāsas',skin:['all'],price:'low',feat:['vegan'],brand:'Brand B',rating:4.0},
  {id:'p3',name:'Mega Skropstu tuša Pro',type:'Skropstu tušas',skin:['all'],price:'mid',feat:['sensitive'],brand:'Brand C',rating:4.7},
  {id:'p4',name:'Lux Foundation',type:'Tonālie krēmi',skin:['taukainai','jaukti'],price:'high',feat:['sensitive','vegan'],brand:'Brand D',rating:4.8}
];

document.addEventListener('DOMContentLoaded', ()=>{
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  if(searchBtn){
    searchBtn.addEventListener('click', ()=>{
      const q = searchInput.value.trim();
      window.location.href = 'products.html?q='+encodeURIComponent(q);
    });
  }

  document.querySelectorAll('.quick').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const t = a.dataset.type;
      window.location.href = 'products.html?cat='+encodeURIComponent(t);
    });
  });

  const productForm = document.getElementById('productForm');
  if(productForm){
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q')||'';
    const cat = params.get('cat')||'';
    productForm.q.value = q;
    if(cat) productForm.q.value = cat;

    productForm.addEventListener('submit', e=>{
      e.preventDefault();
      const form = new FormData(productForm);
      const criteria = {
        q: (form.get('q')||'').toLowerCase(),
        skin: form.get('skin'),
        price: form.get('price'),
        feats: form.getAll('feat')
      };
      const res = findProducts(criteria);
      renderResults(res);
    });

    document.getElementById('resetBtn').addEventListener('click', ()=>{
      productForm.reset();
      document.getElementById('results').innerHTML='';
    });

    if(q||cat){
      productForm.dispatchEvent(new Event('submit'));
    }
  }

  if(document.getElementById('favList')){
    renderFavorites();
  }
});

function findProducts(criteria){
  return SAMPLE_PRODUCTS.filter(p=>{
    const qMatch = !criteria.q || p.name.toLowerCase().includes(criteria.q) || p.type.toLowerCase().includes(criteria.q);
    const skinMatch = (criteria.skin==='all') || (!criteria.skin) || p.skin.includes(criteria.skin) || p.skin.includes('all');
    const priceMatch = (criteria.price==='any') || (!criteria.price) || p.price===criteria.price;
    const feats = criteria.feats || [];
    const featMatch = feats.every(f=> p.feat.includes(f));
    return qMatch && skinMatch && priceMatch && featMatch;
  });
}

function renderResults(items){
  const el = document.getElementById('results');
  if(!el) return;
  el.innerHTML = '';
  if(items.length===0){ el.innerHTML = '<p>Neatrasts neviens produkts — mēģini mainīt filtrus.</p>'; return }
  items.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<h3>${escapeHtml(p.name)}</h3>
      <p class="meta">${escapeHtml(p.brand)} • ${escapeHtml(p.type)} • ${p.rating}★</p>
      <p>${priceLabel(p.price)}</p>
      <p class="meta">Īpašības: ${p.feat.join(', ')}</p>
      <div><button class="fav-btn" data-id="${p.id}">${isFav(p.id)?'Noņemt no favorītiem':'Pievienot favorītiem'}</button></div>`;
    el.appendChild(card);
  });
  document.querySelectorAll('.fav-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.dataset.id;
      toggleFav(id);
      b.textContent = isFav(id)?'Noņemt no favorītiem':'Pievienot favorītiem';
    });
  });
}

function priceLabel(code){
  if(code==='low') return 'Cena: Lēts (<10€)';
  if(code==='mid') return 'Cena: Vidējs (10€–30€)';
  if(code==='high') return 'Cena: Dārgāks (>30€)';
  return 'Cena: Nav info';
}

function escapeHtml(s){ return String(s).replace(/[&<>\\"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c] || c)) }

// Favorīti (localStorage)
function getFavs(){ try{ return JSON.parse(localStorage.getItem('bf_favs')||'[]') }catch(e){return []} }
function saveFavs(a){ localStorage.setItem('bf_favs', JSON.stringify(a)) }
function isFav(id){ return getFavs().includes(id) }
function toggleFav(id){
  const favs = getFavs();
  const idx = favs.indexOf(id);
  if(idx===-1) favs.push(id); else favs.splice(idx,1);
  saveFavs(favs);
  if(document.getElementById('favList')) renderFavorites();
}

function renderFavorites(){
  const el = document.getElementById('favList'); if(!el) return;
  const favs = getFavs();
  if(favs.length===0){ el.innerHTML='<p>Nav saglabātu favorītu.</p>'; return }
  const items = SAMPLE_PRODUCTS.filter(p=> favs.includes(p.id));
  el.innerHTML = '';
  items.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<h3>${escapeHtml(p.name)}</h3>
      <p class="meta">${escapeHtml(p.brand)} • ${escapeHtml(p.type)} • ${p.rating}★</p>
      <p>${priceLabel(p.price)}</p>
      <div><button class="fav-btn" data-id="${p.id}">Noņemt no favorītiem</button></div>`;
    el.appendChild(card);
  });
  document.querySelectorAll('.fav-btn').forEach(b=>{
    b.addEventListener('click', ()=>{ toggleFav(b.dataset.id); });
  });
}
