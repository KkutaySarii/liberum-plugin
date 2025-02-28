const API_URL = "https://liberum-5732e06e3d8e.herokuapp.com";

const updateVisit = async (domain) => {
  const url = `${API_URL}/domains/${domain}/visit`;

  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log(`📈 ${domain} ziyaret sayısı güncellendi.`);
    } else {
      console.error(`❌ ${domain} ziyaret sayısı güncellenemedi.`);
    }
  } catch (error) {
    console.error(`❌ ${domain} ziyaret sayısı güncellenemedi.`);
  }
};
