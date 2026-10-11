// Rehberin etkileşimleri: kopyalama, ilerleme kaydı, içindekiler, karakter vitrini, tema ve yazı boyutu
(() => {
  const $ = (s, k = document) => k.querySelector(s);
  const $$ = (s, k = document) => [...k.querySelectorAll(s)];
  const azHareket = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Tarayıcı belleği: gizli pencerede ya da kapalıysa sessizce çalışmaya devam et
  const bellek = {
    al(a) { try { return localStorage.getItem(a); } catch { return null; } },
    koy(a, d) { try { localStorage.setItem(a, d); } catch { /* yok say */ } },
    sil(a) { try { localStorage.removeItem(a); } catch { /* yok say */ } },
  };

  // ------------------------------------------------ tema ve yazı boyutu
  const kok = document.documentElement;
  const kayitliTema = bellek.al("jr-tema");
  if (kayitliTema) kok.dataset.tema = kayitliTema;
  $("#tema-dugme")?.addEventListener("click", () => {
    const karanlikMi = kok.dataset.tema ? kok.dataset.tema === "karanlik" : matchMedia("(prefers-color-scheme: dark)").matches;
    kok.dataset.tema = karanlikMi ? "aydinlik" : "karanlik";
    bellek.koy("jr-tema", kok.dataset.tema);
  });
  let olcek = Number(bellek.al("jr-olcek")) || 1;
  const olcekUygula = () => { kok.style.setProperty("--olcek", olcek); bellek.koy("jr-olcek", olcek); };
  olcekUygula();
  $("#kucult")?.addEventListener("click", () => { olcek = Math.max(0.85, +(olcek - 0.1).toFixed(2)); olcekUygula(); });
  $("#buyut")?.addEventListener("click", () => { olcek = Math.min(1.5, +(olcek + 0.1).toFixed(2)); olcekUygula(); });

  // ------------------------------------------------ kopyala düğmeleri
  async function kopyala(metin) {
    try { await navigator.clipboard.writeText(metin); return true; } catch {
      const t = document.createElement("textarea");
      t.value = metin; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.append(t); t.select();
      let tamam = false;
      try { tamam = document.execCommand("copy"); } catch { /* yok say */ }
      t.remove();
      return tamam;
    }
  }
  document.addEventListener("click", async (o) => {
    const d = o.target.closest(".kopyala");
    if (!d) return;
    const tamam = await kopyala(d.dataset.kopya);
    d.textContent = tamam ? "Kopyalandı" : "Seçip kopyala";
    d.classList.toggle("kopyalandi", tamam);
    setTimeout(() => { d.textContent = "Kopyala"; d.classList.remove("kopyalandi"); }, 1800);
  });

  // ------------------------------------------------ kutucuklar ve kurulum ilerlemesi
  const kutucuklar = $$('input[type="checkbox"][data-anahtar]');
  for (const k of kutucuklar) {
    k.checked = bellek.al("jr-" + k.dataset.anahtar) === "1";
    k.addEventListener("change", () => {
      k.checked ? bellek.koy("jr-" + k.dataset.anahtar, "1") : bellek.sil("jr-" + k.dataset.anahtar);
      ilerlemeGuncelle();
    });
  }
  function ilerlemeGuncelle() {
    const adimlar = new Map();  // h2 id -> [kutucuklar]
    for (const k of $$("input[data-adim]")) {
      if (!adimlar.has(k.dataset.adim)) adimlar.set(k.dataset.adim, []);
      adimlar.get(k.dataset.adim).push(k);
    }
    let kurulumToplam = 0, kurulumBiten = 0;
    for (const [id, liste] of adimlar) {
      const bitti = liste.every((k) => k.checked);
      $(`.icindekiler a[href="#${CSS.escape(id)}"]`)?.classList.toggle("tamam", bitti);
      if (id.startsWith("adim-")) { kurulumToplam += 1; if (bitti) kurulumBiten += 1; }
    }
    $("#kurulum-sayi").textContent = `${kurulumBiten} / ${kurulumToplam}`;
    $("#kurulum-cubuk").style.width = kurulumToplam ? `${(kurulumBiten / kurulumToplam) * 100}%` : "0";
  }
  ilerlemeGuncelle();
  const sifirla = $("#sifirla");
  sifirla?.addEventListener("click", () => {
    if (sifirla.dataset.emin !== "1") {
      sifirla.dataset.emin = "1"; sifirla.textContent = "Emin misin? Tekrar dokun";
      setTimeout(() => { sifirla.dataset.emin = ""; sifirla.textContent = "İşaretleri sıfırla"; }, 3000);
      return;
    }
    for (const k of kutucuklar) { k.checked = false; bellek.sil("jr-" + k.dataset.anahtar); }
    sifirla.dataset.emin = ""; sifirla.textContent = "İşaretleri sıfırla";
    ilerlemeGuncelle();
  });

  // ------------------------------------------------ içindekiler: etkin bölüm, arama, mobil menü
  const yan = $(".yan");
  $("#menu-dugme")?.addEventListener("click", () => {
    const acik = yan.classList.toggle("acik");
    $("#menu-dugme").setAttribute("aria-expanded", String(acik));
  });
  $(".icindekiler")?.addEventListener("click", (o) => { if (o.target.closest("a") && innerWidth <= 980) yan.classList.remove("acik"); });

  const baglantilar = new Map($$(".icindekiler a").map((a) => [a.getAttribute("href").slice(1), a]));
  const hedefler = $$("main .bolum, main h2[id]");
  const gozcu = new IntersectionObserver((girdiler) => {
    for (const g of girdiler) {
      if (!g.isIntersecting) continue;
      const id = g.target.id;
      const a = baglantilar.get(id);
      if (!a) continue;
      $$(".icindekiler a.etkin").forEach((x) => x.classList.remove("etkin"));
      a.classList.add("etkin");
      const ust = a.closest(".icindekiler > ol > li");
      $$(".icindekiler > ol > li.acik").forEach((li) => li !== ust && li.classList.remove("acik"));
      ust?.classList.add("acik");
      ust?.querySelector(":scope > a")?.classList.add("etkin");
    }
  }, { rootMargin: "-80px 0px -70% 0px" });
  hedefler.forEach((h) => gozcu.observe(h));

  const ara = $("#ara");
  ara?.addEventListener("input", () => {
    const q = ara.value.trim().toLocaleLowerCase("tr");
    $(".icindekiler").classList.toggle("araniyor", !!q);
    for (const li of $$(".icindekiler li")) {
      const kendi = li.querySelector(":scope > a").textContent.toLocaleLowerCase("tr").includes(q);
      const alt = $$("li > a", li).some((a) => a.textContent.toLocaleLowerCase("tr").includes(q));
      li.hidden = !!q && !kendi && !alt;
    }
  });

  // ------------------------------------------------ okuma ilerlemesi ve yukarı düğmesi
  const cubuk = $(".ilerleme"), yukari = $(".yukari");
  addEventListener("scroll", () => {
    const h = document.documentElement;
    const oran = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    cubuk.style.width = `${oran * 100}%`;
    yukari.classList.toggle("gorunur", h.scrollTop > 900);
  }, { passive: true });
  yukari?.addEventListener("click", () => scrollTo({ top: 0 }));

  // ------------------------------------------------ karakter vitrini
  const sahne = $(".sahne");
  if (sahne) {
    const resimler = $$("img", sahne), noktalar = $$(".noktalar button");
    const ad = $("#vitrin-ad"), tur = $("#vitrin-tur");
    let sira = 0, sayac = null;
    const goster = (i) => {
      sira = (i + resimler.length) % resimler.length;
      resimler.forEach((r, j) => r.classList.toggle("etkin", j === sira));
      noktalar.forEach((n, j) => n.setAttribute("aria-pressed", String(j === sira)));
      const r = resimler[sira];
      sahne.style.setProperty("--karakter-renk", r.dataset.renk);
      ad.textContent = r.dataset.ad;
      tur.textContent = r.dataset.tur;
    };
    const baslat = () => { if (!azHareket) { clearInterval(sayac); sayac = setInterval(() => goster(sira + 1), 3400); } };
    noktalar.forEach((n, j) => n.addEventListener("click", () => { goster(j); baslat(); }));
    sahne.addEventListener("mouseenter", () => clearInterval(sayac));
    sahne.addEventListener("mouseleave", baslat);
    goster(0); baslat();
  }

  // ------------------------------------------------ yazan terminal (görününce bir kez)
  const terminal = $(".terminal");
  if (terminal) {
    const yazilan = $(".yazilan", terminal);
    const metin = yazilan.dataset.yaz;
    if (azHareket) { terminal.classList.add("bitti"); return; }
    yazilan.textContent = "";
    const izle = new IntersectionObserver(([g]) => {
      if (!g.isIntersecting) return;
      izle.disconnect();
      let i = 0;
      const t = setInterval(() => {
        yazilan.textContent = metin.slice(0, ++i);
        if (i >= metin.length) { clearInterval(t); setTimeout(() => terminal.classList.add("bitti"), 500); }
      }, 70);
    }, { threshold: 0.6 });
    izle.observe(terminal);
  }
})();
