// Yöresel zeybek oyunları veritabanı
// ritim dizisi: 2 = güçlü vuruş (DUM), 1 = zayıf vuruş (tak), 0 = sessizlik
// bpm: dakikadaki vuruş sayısı (tempo)
const zeybekler = [
    {
        ad: "Harmandalı Zeybeği",
        yore: "İzmir",
        koordinat: [38.4237, 27.1428],
        tempo: "Ağır",
        olcu: "9/8",
        bpm: 60,
        ritim: [2, 1, 1, 2, 1, 1, 2, 1, 2],
        aciklama: "Zeybek oyunlarının en tanınmışlarından biridir. Ağır ve vakur tavrıyla bilinir. İzmir'in Harmandalı köyünden adını almıştır.",
        ozellikler: ["Ağır tempolu", "Tek kişi ile oynanır", "Efe duruşu belirgindir"]
    },
    {
        ad: "Aydın Zeybeği",
        yore: "Aydın",
        koordinat: [37.8560, 27.8416],
        tempo: "Ağır",
        olcu: "9/8",
        bpm: 65,
        ritim: [2, 1, 0, 2, 1, 0, 2, 1, 2],
        aciklama: "Aydın yöresinin karakteristik zeybek oyunudur. Efelerin mertlik ve cesaretini yansıtır.",
        ozellikler: ["Kollar yanlara açılır", "Diz çökme figürü vardır", "Yiğitlik temsilidir"]
    },
    {
        ad: "Muğla Zeybeği",
        yore: "Muğla",
        koordinat: [37.2153, 28.3636],
        tempo: "Orta",
        olcu: "9/8",
        bpm: 95,
        ritim: [2, 1, 1, 2, 1, 1, 2, 1, 1],
        aciklama: "Muğla yöresine özgü zeybek formudur. Daha akıcı figürleri ile dikkat çeker.",
        ozellikler: ["Orta tempo", "Yumuşak geçişler", "Grup olarak da oynanabilir"]
    },
    {
        ad: "Denizli Zeybeği",
        yore: "Denizli",
        koordinat: [37.7765, 29.0864],
        tempo: "Ağır",
        olcu: "9/8",
        bpm: 58,
        ritim: [2, 0, 1, 2, 0, 1, 2, 1, 2],
        aciklama: "Denizli yöresinin geleneksel zeybek oyunu. Sert ve mağrur figürleri ile öne çıkar.",
        ozellikler: ["Sert figürler", "Göğüs gerili duruş", "Yere diz vurma"]
    },
    {
        ad: "Kadıoğlu Zeybeği",
        yore: "Afyonkarahisar",
        koordinat: [38.7507, 30.5567],
        tempo: "Ağır",
        olcu: "9/8",
        bpm: 62,
        ritim: [2, 1, 1, 2, 1, 1, 2, 1, 2],
        aciklama: "İç Ege'nin tanınmış zeybeklerindendir. Adını Kadıoğlu efeden alır.",
        ozellikler: ["Hikayesi olan zeybek", "Efe temalı", "Dramatik anlatım"]
    },
    {
        ad: "Sarı Zeybek",
        yore: "Balıkesir",
        koordinat: [39.6484, 27.8826],
        tempo: "Ağır",
        olcu: "9/8",
        bpm: 60,
        ritim: [2, 1, 1, 2, 1, 1, 2, 0, 2],
        aciklama: "Balıkesir yöresinin ünlü zeybek oyunu. Sarı Efe'nin hikayesini anlatır.",
        ozellikler: ["Kahramanlık teması", "Ağır ve ağırbaşlı", "Tek kişilik"]
    },
    {
        ad: "Soma Zeybeği",
        yore: "Manisa",
        koordinat: [38.6191, 27.4289],
        tempo: "Orta",
        olcu: "9/8",
        bpm: 100,
        ritim: [2, 1, 1, 2, 1, 1, 2, 1, 1],
        aciklama: "Manisa Soma yöresinin karakteristik zeybek formudur.",
        ozellikler: ["Madenci kültürüyle bağlantılı", "Canlı figürler", "Topluluk oyunu"]
    },
    {
        ad: "Teke Zortlatması",
        yore: "Burdur",
        koordinat: [37.7203, 30.2908],
        tempo: "Hızlı",
        olcu: "9/16",
        bpm: 180,
        ritim: [2, 0, 1, 2, 0, 1, 2, 1, 2],
        aciklama: "Teke yöresinin (Burdur-Antalya) hızlı tempolu zeybek benzeri oyunudur.",
        ozellikler: ["Çok hızlı tempo", "Sıçrama figürleri", "Kaval eşliğinde"]
    }
];