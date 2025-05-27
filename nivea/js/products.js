$(function () {
    const ITEMS_PER_PAGE = 12;
    const subCategories = {
        "베스트": [],
        "페이스": ["크림", "립케어"],
        "바디": ["바디로션", "데오드란트", "핸드케어"],
        "선": ["멀티", "페이스", "바디", "키즈"],
        "니베아맨": ["쉐이빙", "데오드란트", "클렌징"]
    };

    let currentSortOption = '추천순';

       const allProducts = [
        {
            "image": "img/best_seller1.png",
            "title": "니베아 인샤워 바디로션 나리싱",
            "volume": "400ml 1+1",
            "discount": "29%",
            "original": "33,800원",
            "price": "23,700원",
            "rating": "4.8(43)",
            "skinType": [
                "모든 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "2만원 대",
            "isBestSeller": true,
            "category": [
                "베스트",
                "바디"
            ],
            "id": 1
        },
        {
            "image": "img/best_seller2.png",
            "title": "히알루론 모이스쳐 플러스 립케어",
            "volume": "5.2g X 4",
            "discount": "23%",
            "original": "23,600원",
            "price": "18,100원",
            "rating": "4.86(2,640)",
            "skinType": [
                "건조한 피부"
            ],
            "productType": [
                "립케어"
            ],
            "target": [
                "여성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": true,
            "category": [
                "베스트",
                "페이스"
            ],
            "id": 2
        },
        {
            "image": "img/best_seller3.png",
            "title": "소프트 리프레싱 모이스춰 크림",
            "volume": "200ml X 2",
            "discount": "10%",
            "original": "15,200원",
            "price": "13,600원",
            "rating": "4.91(575)",
            "skinType": [
                "모든 피부"
            ],
            "productType": [
                "바디케어",
                "페이스크림", "크림", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": true,
            "category": [
                "베스트",
                "페이스",
                "바디"
            ],
            "id": 3
        },
        {
            "image": "img/best_seller4.png",
            "title": "니베아 SOS 케어 바디로션",
            "volume": "400ml 1+1",
            "discount": "50%",
            "original": "37,800원",
            "price": "18,900원",
            "rating": "4.88(13,076)",
            "skinType": [
                "모든 피부",
                "건조한 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "2만원 대",
            "isBestSeller": true,
            "category": [
                "베스트",
                "바디"
            ],
            "id": 4
        },
        {
            "image": "img/인텐시브케어.png",
            "title": "니베아 인텐시브 케어 바디로션",
            "volume": "400ml 1+1",
            "discount": "53%",
            "original": "33,800원",
            "price": "15,700원",
            "rating": "4.85(2,558)",
            "skinType": [
                "매우 건조한 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": true,
            "category": [
                "베스트",
                "바디"
            ],
            "id": 6
        },
        {
            "image": "img/인텐시브로션.png",
            "title": "니베아 인텐시브 바디로션",
            "volume": "400ml 1+1",
            "discount": "51%",
            "original": "33,800원",
            "price": "16,562원",
            "rating": "4.8(1,558)",
            "skinType": [
                "매우 건조한 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": true,
            "category": [
                "베스트",
                "바디"
            ],
            "id": 7
        },
        {
            "image": "img/큐텐바디로션.png",
            "title": "니베아 Q10 화이트 바디로션",
            "volume": "400ml 1+1",
            "discount": "52%",
            "original": "33,800원",
            "price": "16,050원",
            "rating": "4.7(165)",
            "skinType": [
                "모든 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": false,
            "category": [
                "바디"
            ],
            "id": 8
        },
        {
            "image": "img/인텐시브케어바디로션.png",
            "title": "니베아 인텐시브 케어 바디로션",
            "volume": "125ml X 3ea",
            "discount": "",
            "original": "",
            "price": "14,100원",
            "rating": "4.9(149)",
            "skinType": [
                "건조한 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": false,
            "category": [
                "바디"
            ],
            "id": 10
        },
        {
            "image": "img/sos바디로션1.png",
            "title": "니베아 SOS 케어 바디로션",
            "volume": "400ml",
            "discount": "",
            "original": "",
            "price": "18,900원",
            "rating": "4.88(144)",
            "skinType": [
                "건조한 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "2만원 대",
            "isBestSeller": true,
            "category": [
                "바디"
            ],
            "id": 11
        },
        {
            "image": "img/큐텐바디로션1.png",
            "title": "니베아 Q10 화이트 바디로션",
            "volume": "400ml",
            "discount": "",
            "original": "",
            "price": "16,900원",
            "rating": "4.7(45)",
            "skinType": [
                "보통 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": false,
            "category": [
                "바디"
            ],
            "id": 12
        },
        {
            "image": "img/인텐시브케어바디로션2.png",
            "title": "니베아 인텐시브 케어 바디로션",
            "volume": "400ml",
            "discount": "",
            "original": "",
            "price": "16,900원",
            "rating": "5.0(5)",
            "skinType": [
                "매우 건조한 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": false,
            "category": [
                "바디"
            ],
            "id": 13
        },
        {
            "image": "img/인텐시브로션1.png",
            "title": "니베아 인텐시브 바디로션",
            "volume": "400ml",
            "discount": "",
            "original": "",
            "price": "10,900원",
            "rating": "4.85(149)",
            "skinType": [
                "건조한 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": false,
            "category": [
                "바디"
            ],
            "id": 14
        },
        {
            "image": "img/나리싱.png",
            "title": "니베아 인샤워 바디로션 나리싱",
            "volume": "400ml",
            "discount": "",
            "original": "",
            "price": "16,900원",
            "rating": "4.82(45)",
            "skinType": [
                "모든 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": false,
            "category": [
                "바디"
            ],
            "id": 15
        },
        {
            "image": "img/리페어로션.png",
            "title": "니베아 리페어 & 케어 바디 로션",
            "volume": "625ml",
            "discount": "",
            "original": "",
            "price": "21,500원",
            "rating": "4.8(183)",
            "skinType": [
                "매우 건조한 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "2만원 대",
            "isBestSeller": false,
            "category": [
                "바디"
            ],
            "id": 16
        },
        {
            "image": "img/인샤워코코아버터.png",
            "title": "인샤워 바디로션 코코아 버터",
            "volume": "400ml",
            "discount": "",
            "original": "",
            "price": "16,500원",
            "rating": "4.6(1,467)",
            "skinType": [
                "보통 피부"
            ],
            "productType": [
                "바디케어", "바디로션"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": false,
            "category": [
                "바디"
            ],
            "id": 17
        },
        {
            "image": "img/에프터선모이스춰.png",
            "title": "니베아 애프터 썬로션",
            "volume": "200ml",
            "discount": "",
            "original": "",
            "price": "14,500원",
            "rating": "4(1)",
            "skinType": [
                "모든 피부"
            ],
            "productType": [
                "선케어",
                "바디"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": false,
            "category": [
                "선"
            ],
            "id": 18
        },
        {
            "image": "img/선터치로션.png",
            "title": "니베아 선 터치 태닝 바디 로션",
            "volume": "400ml",
            "discount": "",
            "original": "",
            "price": "17,200원",
            "rating": "4.65(4)",
            "skinType": [
                "보통 피부"
            ],
            "productType": [
                "선케어",
                "바디"
            ],
            "target": [
                "여성",
                "남성"
            ],
            "priceRange": "1만원 대",
            "isBestSeller": false,
            "category": [
                "선"
            ],
            "id": 19
        },
    ];
    function getQueryParam(key) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(key);
    }

    function parsePrice(priceStr) {
        if (!priceStr) return 0;
        return parseInt(priceStr.replace(/,/g, '').replace('원', ''), 10);
    }

    function applyFilters(products, filters) {
        return products.filter(p => {
            const matchSkin = filters.skinType.length === 0 || filters.skinType.some(s => p.skinType.includes(s));
            const matchType = filters.productType.length === 0 || filters.productType.some(t => p.productType.includes(t));
            const matchTarget = filters.target.length === 0 || filters.target.some(t => p.target.includes(t));
            const matchPrice = filters.priceRange.length === 0 || filters.priceRange.includes(p.priceRange);
            const matchBest = !filters.isBestSeller || p.isBestSeller === true;
            return matchSkin && matchType && matchTarget && matchPrice && matchBest;
        });
    }

    function renderTabs(selectedCategory = '전체보기') {
        $('.primary_tab li').removeClass('active');
        $(`.primary_tab li[data-category="${selectedCategory}"]`).addClass('active');
        $('#current-category').text(selectedCategory);

        const $subList = $('#subcategory-list');
        $subList.empty();

        if (selectedCategory === '전체보기') {
            $subList.hide();
            renderCurrentFilteredProducts();
        } else {
            const subs = subCategories[selectedCategory] || [];
            if (subs.length > 0) {
                subs.forEach(item => $subList.append(`<li><a href="#">${item}</a></li>`));
                $subList.show();
            } else {
                $subList.hide();
            }
            renderCurrentFilteredProducts();
        }
    }

    function renderFilteredProducts(products, currentPage = 1) {
        const $list = $('.pd_list');
        $list.empty();

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const visibleProducts = products.slice(start, end);

        visibleProducts.forEach((p, i) => {
            const discountHTML = p.discount
                ? `<div class="discount_price"><p>${p.discount}</p><em>${p.original}</em><strong>${p.price}</strong></div>`
                : `<div class="discount_price"><strong>${p.price}</strong></div>`;

            const html = `
        <li class="bs${(i % 4) + 1}">
            <a href="#">
                <div class="bs_top">
                    <div class="bs_img"><img src="${p.image}" alt="${p.title}"></div>
                </div>
                <div class="bs_bottom">
                    <strong>${p.title}<br><p class="mb_p">${p.volume}</p></strong>
                    ${discountHTML}
                    <div class="scope">
                        <img src="img/star.png" alt="별">
                        <span>${p.rating}</span>
                    </div>
                </div>
            </a>
            <button type="button" class="bs_btn">담기</button>
        </li>`;
            $list.append(html);
        });

        $('.product_top span').text(products.length);
        renderPagination(products.length, currentPage);
    }

    function renderPagination(totalItems, currentPage) {
        const $pagination = $('.pagination');
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        if (totalPages <= 1) {
            $pagination.hide();
            return;
        }

        $pagination.show();
        const $ul = $pagination.find('ul');
        $ul.empty();

        for (let i = 1; i <= totalPages; i++) {
            const active = i === currentPage ? 'class="active"' : '';
            $ul.append(`<li ${active}><a href="#" data-page="${i}">${i}</a></li>`);
        }
    }

    function updateBreadcrumb(category = null) {
        const $breadcrumb = $('#breadcrumb');
        const label = category === '전체보기' || !category ? '전체보기' : category;
        $breadcrumb.html(`<span>제품</span> &gt; <span>${label}</span>`);
    }

    function renderCurrentFilteredProducts(page = 1) {
        const mainCat = $('.primary_tab li.active').data('category');
        const sub = $('.secondary_tab li.active').text();
        let products = [...allProducts];

        if (mainCat && mainCat !== '전체보기') {
            products = products.filter(p => p.category.includes(mainCat));
            if (sub) {
                products = products.filter(p => p.productType.includes(sub));
            }
        }

        const filters = {
            skinType: [],
            productType: [],
            target: [],
            priceRange: [],
            isBestSeller: false
        };

        $('.filter_wrap input[type="checkbox"]:checked').each(function () {
            const label = $(this).closest('label').text().trim();
            if (["모든 피부", "건조한 피부", "매우 건조한 피부", "보통 피부", "어린이 피부"].includes(label)) filters.skinType.push(label);
            else if (["바디케어", "페이스크림", "데오드란트", "선케어", "쉐이빙", "핸드케어", "립케어"].includes(label)) filters.productType.push(label);
            else if (["여성", "남성", "베이비"].includes(label)) filters.target.push(label);
            else if (["1만원 미만", "1만원 대", "2만원 대", "3만원 이상"].includes(label)) filters.priceRange.push(label);
            else if (label === "베스트셀러") filters.isBestSeller = true;
        });

        products = applyFilters(products, filters);

        if (currentSortOption === '낮은 가격순') {
            products.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        } else if (currentSortOption === '높은 가격순') {
            products.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        }

        renderFilteredProducts(products, page);
    }

    $('.primary_tab li').click(function (e) {
        e.preventDefault();
        const selected = $(this).data('category');
        renderTabs(selected);
        updateBreadcrumb(selected);
    });

    $(document).on('click', '.secondary_tab li', function (e) {
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        renderCurrentFilteredProducts();
    });

    $(document).on('click', '.pagination li a', function (e) {
        e.preventDefault();
        const page = parseInt($(this).data('page'));
        renderCurrentFilteredProducts(page);
    });

    $('.product_top select').on('change', function () {
        currentSortOption = $(this).val();
        renderCurrentFilteredProducts();
    });

    $('.filter_wrap input[type="checkbox"]').on('change', function () {
        renderCurrentFilteredProducts();
    });

    $('.filter_reset').on('click', function () {
        $('.filter_wrap input[type="checkbox"]').prop('checked', false);
        currentSortOption = '추천순';
        $('.product_top select').val('추천순');
        renderCurrentFilteredProducts();
    });

    const initCategory = getQueryParam('category') || '전체보기';
    renderTabs(initCategory);
    updateBreadcrumb(initCategory);
});
