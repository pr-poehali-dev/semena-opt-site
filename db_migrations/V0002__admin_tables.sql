CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    date_label VARCHAR(100) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    text TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    img VARCHAR(500) NOT NULL DEFAULT '',
    items TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_lists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    size_label VARCHAR(50) NOT NULL DEFAULT '',
    date_label VARCHAR(50) NOT NULL DEFAULT '',
    file_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
    token VARCHAR(128) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

INSERT INTO news (slug, date_label, tag, title, text, content) VALUES
('podsolnechnik-lakomka', '18 апреля', 'Поступление', 'Новая партия семян подсолнечника «Лакомка»', 'Привезли 2 тонны свежего урожая 2026 года. Всхожесть 98%, калибровка по стандарту ГОСТ.', 'На склад поступила крупная партия семян подсолнечника сорта «Лакомка» урожая 2026 года — всего 2 тонны.\n\nСорт «Лакомка» — среднеранний, кондитерского назначения. Ядро крупное, вкусное, хорошо отделяется от шелухи.\n\nКалибровка выполнена по стандарту ГОСТ 22391-2015. Отгружаем от 10 кг, при заказе от 500 кг действует оптовая цена.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO catalog_items (name, count, img, items, sort_order) VALUES
('Овощные культуры', 186, 'https://cdn.poehali.dev/projects/6e30ca34-8fe1-4535-8d16-622fe38c58fb/files/4c240e5e-747f-409a-9009-d91f9e9e64cb.jpg', 'Томаты,Огурцы,Перец,Капуста,Морковь', 1),
('Зерновые и масличные', 42, 'https://cdn.poehali.dev/projects/6e30ca34-8fe1-4535-8d16-622fe38c58fb/files/a1c310be-a37a-41df-bcbd-1078909d16ec.jpg', 'Подсолнечник,Кукуруза,Пшеница,Рапс', 2),
('Цветы и декоративные', 340, 'https://cdn.poehali.dev/projects/6e30ca34-8fe1-4535-8d16-622fe38c58fb/files/576adcb1-4f20-4559-a90a-4201de6ac62a.jpg', 'Петуния,Бархатцы,Астра,Циния,Космея', 3)
ON CONFLICT DO NOTHING;