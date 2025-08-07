// static/script.js (API 호출 최종본)

document.addEventListener('DOMContentLoaded', () => {
    
    const saunaContainer = document.getElementById('sauna-container');
    const searchInput = document.getElementById('search-input');
    const langEnButton = document.getElementById('lang-en');
    const langJaButton = document.getElementById('lang-ja');
    const langKoButton = document.getElementById('lang-ko');

    let allSaunas = [];

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const displaySaunas = (saunas) => {
        let currentLang = document.querySelector('.btn-group .active')?.dataset.lang || 'ko';
        let cardsHtml = '';
        if (!saunas || saunas.length === 0) {
            cardsHtml = '<p class="text-center text-secondary">결과를 찾을 수 없습니다. 다른 검색어로 시도해 보세요.</p>';
        } else {
            saunas.forEach(sauna => {
                const name = sauna[`name_${currentLang}`] || sauna['name_ko'];
                const address = sauna[`address_${currentLang}`] || sauna['address_ko'];
                const imageUrl = sauna.image_url || 'https://placehold.co/600x400/EFEFEF/777777?text=No+Image';

                cardsHtml += `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card h-100 shadow-sm">
                            <img src="${imageUrl}" class="card-img-top" alt="${name}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/EFEFEF/777777?text=Image+Error';">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${name}</h5>
                                <p class="card-text text-muted flex-grow-1">${address}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        saunaContainer.innerHTML = cardsHtml;
    };

    const applyFilters = () => {
        const nameQuery = searchInput.value.toLowerCase();
        let filteredData = allSaunas;
        if (nameQuery) {
            filteredData = allSaunas.filter(sauna => 
                (sauna.name_ko && sauna.name_ko.toLowerCase().includes(nameQuery)) ||
                (sauna.name_en && sauna.name_en.toLowerCase().includes(nameQuery)) ||
                (sauna.name_ja && sauna.name_ja.toLowerCase().includes(nameQuery))
            );
        }
        displaySaunas(filteredData);
    };
    
    // [수정됨] 페이지 초기화 함수
    const initialize = async () => {
        try {
            // [수정됨] /api/data API를 호출하여 데이터를 가져오는 방식으로 복원합니다.
            const response = await fetch('/api/data');
            if (!response.ok) throw new Error('데이터를 불러오지 못했습니다.');
            
            allSaunas = await response.json();
            displaySaunas(allSaunas);

        } catch (error) {
            console.error("초기화 중 오류 발생:", error);
            saunaContainer.innerHTML = `<p class="text-center text-danger">데이터를 불러오는 중 오류가 발생했습니다. static 폴더에 my_data.json 파일이 있는지 확인해주세요.</p>`;
        }
    };

    searchInput.addEventListener('input', debounce(applyFilters, 300));
    
    document.querySelectorAll('.btn-group .btn').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelector('.btn-group .active')?.classList.remove('active');
            e.currentTarget.classList.add('active');
            e.currentTarget.dataset.lang = e.currentTarget.id.replace('lang-', '');
            applyFilters();
        });
    });
    
    langKoButton.classList.add('active');
    langKoButton.dataset.lang = 'ko';
    
    initialize();
});
