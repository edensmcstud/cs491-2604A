export default function PriceSlider({
    minPrice,
    maxPrice,
    priceLimit,
    setMinPrice,
    setMaxPrice
}) {
    const handleMinChange = (e) => {
        const val = Number(e.target.value);
        setMinPrice(val <= maxPrice ? val : maxPrice);
    };

    const handleMaxChange = (e) => {
        const val = Number(e.target.value);
        setMaxPrice(val >= minPrice ? val : minPrice);
    };

    return (
        <div className="price-slider">
            <h4>Price Range</h4>

            <div className="price-slider-track-wrapper">
                <div className="price-slider-track" />
                <div
                    className="price-slider-range"
                    style={{
                        left: `${(minPrice / priceLimit) * 100}%`,
                        right: `${100 - (maxPrice / priceLimit) * 100}%`
                    }}
                />

                <input
                    type="range"
                    min="0"
                    max={priceLimit}
                    value={minPrice}
                    onChange={handleMinChange}
                    className="price-slider-input"
                />

                <input
                    type="range"
                    min="0"
                    max={priceLimit}
                    value={maxPrice}
                    onChange={handleMaxChange}
                    className="price-slider-input"
                />
            </div>

            <div className="price-slider-labels">
                <div>Min: ${minPrice}</div>
                <div>Max: ${maxPrice}</div>
            </div>
        </div>
    );
}
