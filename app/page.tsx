"use client"
import { useState, useEffect } from "react"

type Reseau = "Vodacom" | "Orange" | "Airtel" | "Africell"
type Statut = "EN ATTENTE" | "VALIDEE" | "LIVRE"
type Commande = { id: string, boutique: string, telephone: string, quartier: string, montant: number, devise: "$" | "FC", reseau: Reseau, statut: Statut, date: string }
type Boutique = { id: number, nom: string, tel: string, quartier: string }
type Stock = { reseau: Reseau, dispo: number, prixAchat: number }

export default function Page() {
  const [vue, setVue] = useState<"accueil"|"commande"|"bdd">("accueil")

  const [reseau, setReseau] = useState<Reseau>("Vodacom")
  const [nom, setNom] = useState("")
  const [tel, setTel] = useState("")
  const [montant, setMontant] = useState("")
  const [devise, setDevise] = useState<"$"|"FC">("$")
  const [taux, setTaux] = useState(2350)
  const [commandes, setCommandes] = useState<Commande[]>([])

  const [boutiques, setBoutiques] = useState<Boutique[]>([])

  const [stocks, setStocks] = useState<Stock[]>([
    { reseau: "Vodacom", dispo: 145000, prixAchat: 98 },
    { reseau: "Orange", dispo: 80000, prixAchat: 97 },
    { reseau: "Airtel", dispo: 60000, prixAchat: 96 },
  ])

  useEffect(()=>{ const c = localStorage.getItem("em_bdd"); if(c) setCommandes(JSON.parse(c)) },[])
  useEffect(()=>{ localStorage.setItem("em_bdd", JSON.stringify(commandes)) },[commandes])

  const envoyerCommande = () => {
    if(!nom ||!tel ||!montant){ alert("Remplis Nom Boutique, Numéro et Montant!"); return }
    const nouvelle: Commande = { id: "#" + (125 + commandes.length + 1), boutique: nom, telephone: tel, quartier: "Kin", montant: parseFloat(montant), devise, reseau, statut: "EN ATTENTE", date: new Date().toLocaleDateString() }
    setCommandes([nouvelle,...commandes])
    if(!boutiques.find(b=>b.nom.toLowerCase()===nom.toLowerCase())){ setBoutiques([...boutiques, { id: boutiques.length+1, nom, tel, quartier: "Kinshasa" }]) }
    alert("Commande " + nouvelle.id + " enregistrée en EN ATTENTE!")
    setNom(""); setTel(""); setMontant("")
  }
  const validerCommande = (id: string) => {
    setCommandes(commandes.map(c=> c.id===id? {...c, statut: "VALIDEE"} : c))
    alert("COMMANDE VALIDEE - J'ai servi manuellement!")
  }

  // TABLEAU D'ACCUEIL - SANS BOUTON BDD
  if(vue==="accueil"){
    return (
      <div style={{minHeight:"100vh", background:"#f6f5f1", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"Arial"}}>
        <div style={{width:90, height:90, background:"black", borderRadius:22, display:"flex", alignItems:"center", justifyContent:"center"}}>
          <span style={{color:"#d69b2d", fontWeight:"900", fontSize:34}}>EM</span>
        </div>
        <h1 style={{marginTop:25, fontWeight:"900", fontSize:26, textAlign:"center", lineHeight:1.3}}>BIENVENUE A<br/>SHOP EL MATATA</h1>
        <p style={{letterSpacing:8, fontSize:13, marginTop:12, fontWeight:"bold"}}>GROSSISTE</p>
        <p style={{color:"#c0392b", marginTop:28, fontSize:14, opacity:0.8}}>Faites vos commandes en toute sécurité</p>
        <button onClick={()=>setVue("commande")} style={{marginTop:30, background:"#162447", color:"white", padding:"16px 60px", borderRadius:30, fontWeight:"bold", fontSize:16, border:"none", cursor:"pointer"}}>Commencer</button>
      </div>
    )
  }

  return (
    <div style={{minHeight:"100vh", background:"#0d1b2a", color:"white", fontFamily:"Arial", padding:15}}>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span onClick={()=>setVue("accueil")} style={{cursor:"pointer"}}>← Accueil</span>
        <div style={{display:"flex", gap:10}}>
          <button onClick={()=>setVue("commande")} style={{background:vue==="commande"?"#f1c40f":"white", color:"black", padding:"6px 14px", borderRadius:20, fontWeight:"bold", border:"none"}}>Client</button>
          <button onClick={()=>{const c=prompt("CODE SECRET ADMIN:"); if(c==="ELMATATA23071999"){setVue("bdd")} else if(c!==null){alert("CODE FAUX!")}}} style={{background:vue==="bdd"?"#f1c40f":"white", color:"black", padding:"6px 14px", borderRadius:20, fontWeight:"bold", cursor:"pointer"}}>BDD Secrète</button>
        </div>
      </div>

      {vue==="commande" && (
        <div style={{background:"white", color:"black", maxWidth:400, margin:"20px auto", borderRadius:22, padding:22}}>
          <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
            {(["Vodacom","Orange","Airtel","Africell"] as Reseau[]).map(r=>(
              <button key={r} onClick={()=>setReseau(r)} style={{padding:"8px 14px", borderRadius:20, border:"none", fontWeight:"bold", fontSize:12, background: reseau===r? "#ff9f1c" : "#e8ecff", cursor:"pointer"}}>{r}</button>
            ))}
          </div>
          <div style={{marginTop:20}}><label style={{fontSize:12, fontWeight:"bold"}}>Nom SHOP EL MATATA</label><input value={nom} onChange={e=>setNom(e.target.value)} placeholder="SHOP El Matata" style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #ccc", marginTop:6}}/></div>
          <div style={{marginTop:14}}><label style={{fontSize:12, fontWeight:"bold"}}>Numéro</label><input value={tel} onChange={e=>setTel(e.target.value)} placeholder="24389..." style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #ccc", marginTop:6}}/></div>
          <div style={{marginTop:14}}><label style={{fontSize:12, fontWeight:"bold"}}>MONTANT</label><div style={{display:"flex", gap:10, marginTop:6}}><input value={montant} onChange={e=>setMontant(e.target.value)} placeholder="Ex: 10" type="number" style={{flex:1, padding:12, borderRadius:10, border:"1px solid #ccc"}}/><select value={devise} onChange={e=>setDevise(e.target.value as any)} style={{padding:12, borderRadius:10, border:"1px solid #ccc", fontWeight:"bold"}}><option value="$">$</option><option value="FC">FC</option></select></div></div>
          <button onClick={envoyerCommande} style={{width:"100%", marginTop:20, background:"#ffcc00", border:"none", padding:15, borderRadius:14, fontWeight:"900", cursor:"pointer"}}>Commander</button>
        </div>
      )}

      {vue==="bdd" && (
        <div style={{marginTop:20}}>
          <div style={{background:"#ffcc00", color:"black", padding:14, borderRadius:12, fontWeight:"900"}}>TABLE 1: SHOP (Clients) - Cachée</div>
          <div style={{background:"#1b2a4a", borderRadius:10, marginTop:8, overflow:"hidden"}}>
            <div style={{display:"flex", padding:"10px 12px", color:"#ffcc00", fontWeight:"bold", fontSize:11}}><div style={{flex:0.5}}>ID</div><div style={{flex:2}}>Nom</div><div style={{flex:2}}>Téléphone</div><div style={{flex:1}}>Quartier</div></div>
            {boutiques.map(b=><div key={b.id} style={{display:"flex", padding:"9px 12px", borderTop:"1px solid #2a3a5a", fontSize:12}}><div style={{flex:0.5}}>{b.id}</div><div style={{flex:2}}>{b.nom}</div><div style={{flex:2}}>{b.tel}</div><div style={{flex:1}}>{b.quartier}</div></div>)}
          </div>

          <div style={{background:"#ffcc00", color:"black", padding:14, borderRadius:12, fontWeight:"900", marginTop:20}}>TABLE 2: COMMANDES - Le Coeur (Toi seul vois)</div>
          <div style={{background:"#1b2a4a", borderRadius:10, marginTop:8, overflow:"hidden"}}>
            <div style={{display:"flex", padding:"10px 12px", color:"#ffcc00", fontWeight:"bold", fontSize:11}}><div style={{flex:0.7}}>ID</div><div style={{flex:0.7}}>BoutiqueID</div><div style={{flex:1}}>Montant</div><div style={{flex:0.7}}>Devise</div><div style={{flex:1}}>Réseau</div><div style={{flex:1.2}}>Statut</div><div style={{flex:1.5}}>Action</div></div>
            {commandes.map(c=><div key={c.id} style={{display:"flex", padding:"9px 12px", borderTop:"1px solid #2a3a5a", fontSize:11, alignItems:"center"}}><div style={{flex:0.7}}>{c.id}</div><div style={{flex:0.7}}>{boutiques.find(b=>b.nom===c.boutique)?.id || 1}</div><div style={{flex:1}}>{c.montant}</div><div style={{flex:0.7}}>{c.devise}</div><div style={{flex:1}}>{c.reseau}</div><div style={{flex:1.2, fontWeight:"bold", color: c.statut==="EN ATTENTE"?"#ffcc00":"#2ecc71"}}>{c.statut}</div><div style={{flex:1.5}}>{c.statut==="EN ATTENTE"? <button onClick={()=>validerCommande(c.id)} style={{background:"#27ae60", color:"white", border:"none", padding:"5px 8px", borderRadius:6, fontSize:9, fontWeight:"bold", cursor:"pointer"}}>VALIDER - J'ai servi</button> : "✓"}</div></div>)}
          </div>

          <div style={{background:"#ffcc00", color:"black", padding:14, borderRadius:12, fontWeight:"900", marginTop:20}}>TABLE 3: STOCK CENTRAL & TAUX - Toi seul</div>
          <div style={{background:"#1b2a4a", borderRadius:10, marginTop:8, overflow:"hidden"}}>
            <div style={{display:"flex", padding:"10px 12px", color:"#ffcc00", fontWeight:"bold", fontSize:11}}><div style={{flex:1}}>Réseau</div><div style={{flex:1}}>Stock dispo</div><div style={{flex:1}}>Taux FC</div><div style={{flex:1}}>Prix achat</div></div>
            {stocks.map(s=><div key={s.reseau} style={{display:"flex", padding:"9px 12px", borderTop:"1px solid #2a3a5a", fontSize:12}}><div style={{flex:1}}>{s.reseau}</div><div style={{flex:1}}>{s.dispo.toLocaleString()} U</div><div style={{flex:1}}>1$ = {taux} FC</div><div style={{flex:1}}>{s.prixAchat} FC/U</div></div>)}
          </div>
          <div style={{background:"#111", padding:12, borderRadius:10, marginTop:15}}>
            <p style={{fontSize:11, color:"#ffcc00"}}>⚙️ PARAMETRES</p>
            <div style={{display:"flex", alignItems:"center", gap:10, marginTop:8}}><span style={{fontSize:18, fontWeight:"900"}}>1$ = {taux} FC</span><button onClick={()=>{const n=prompt("Nouveau taux?", taux.toString()); if(n) setTaux(parseInt(n))}} style={{background:"#ffcc00", color:"black", border:"none", padding:"4px 10px", borderRadius:5, fontWeight:"bold", fontSize:11}}>MODIFIER</button></div>
          </div>
        </div>
      )}
    </div>
  )
}