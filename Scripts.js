async function buscarClima() {
    const cidade = document.getElementById("cidade").value;
    if (!cidade) {
        Swal.fire("Erro", "Por favor, digite uma cidade!", "error");
        return;
    }

    const apiKeyClima = "5c7020c19295f3e7e8f6406ccf510a77"; 
    const urlClima = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKeyClima}&units=metric&lang=pt_br`;

    try {
        const response = await fetch(urlClima);
        const data = await response.json();

        if (data.cod !== 200) {
            Swal.fire("Erro", "Cidade não encontrada!", "error");
            return;
        }

  
        const weatherIconsMap = {
            "01d": "wi-day-sunny",
            "01n": "wi-night-clear",
            "02d": "wi-day-cloudy",
            "02n": "wi-night-alt-cloudy",
            "03d": "wi-cloud",
            "03n": "wi-cloud",
            "04d": "wi-cloudy",
            "04n": "wi-cloudy",
            "09d": "wi-showers",
            "09n": "wi-showers",
            "10d": "wi-day-rain",
            "10n": "wi-night-alt-rain",
            "11d": "wi-thunderstorm",
            "11n": "wi-thunderstorm",
            "13d": "wi-snow",
            "13n": "wi-snow",
            "50d": "wi-fog",
            "50n": "wi-fog"
        };

      
        const iconCode = data.weather[0].icon;
        const iconClass = weatherIconsMap[iconCode] || "wi-na"; 
       
        document.getElementById("weather-info").innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <h3><i class="wi ${iconClass}" style="font-size: 50px;"></i> ${data.main.temp}°C</h3>
            <h5><i class="wi ${iconClass}" style="font-size: 20px;"></i> ${data.weather[0].description} | Sensação térmica: ${data.main.feels_like}°C <i class="wi wi-thermometer"></i></h5>
            <h6><i class="wi wi-strong-wind"></i> Vento: ${data.wind.speed} m/s</h6>
            <h6><i class="wi wi-humidity"></i> Umidade: ${data.main.humidity}%</h6>
        `;

      
        buscarNoticias(cidade);
    } catch (error) {
        console.error("Erro ao buscar clima:", error);
        Swal.fire("Erro", "Não foi possível obter os dados do clima.", "error");
    }
}

async function buscarNoticias(cidade) {
    const urlNoticias = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(cidade)}&mode=ArtList&format=json`;

    try {
        const response = await fetch(urlNoticias);
        const data = await response.json();

        console.log("Dados recebidos da API:", data); 

        if (!data.articles || !Array.isArray(data.articles) || data.articles.length === 0) {
            Swal.fire("Aviso", "Nenhuma notícia encontrada para esta cidade.", "warning");
            return;
        }

        atualizarNoticias(data.articles);
    } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        Swal.fire("Erro", "Não foi possível obter notícias da cidade.", "error");
    }
}

function atualizarNoticias(articles) {
    const carouselContent = document.getElementById("carousel-content");

   
    carouselContent.innerHTML = "";

    articles.forEach((article, index) => {
        const isActive = index === 0 ? "active" : ""; 
        
        
        const imageUrl = article.image || article.semantics?.image || article.socialimage || "https://via.placeholder.com/250x150";
        
      
        const titulo = article.title || "Sem título disponível";
     
        const slide = `
            <div class="carousel-item ${isActive}">
                <div class="d-flex align-items-center p-4 bg-light" style="border-radius: 12px;">
                    <img src="${imageUrl}" alt="Imagem da notícia" class="img-fluid me-4" 
                         style="width: 350px; height: 250px; object-fit: cover; border-radius: 10px;">
                    <div>
                        <h5>${titulo}</h5>
                    
                        <p><a href="${article.url}" target="_blank" class="btn btn-secondary btn-sm">Leia mais</a></p>

                    </div>
                </div>
            </div>
        `;
        carouselContent.innerHTML += slide;
    });
}
