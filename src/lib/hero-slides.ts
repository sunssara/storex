import { copy, L } from './content';
export const heroSlides = [
  { id: 'infrastructure', label: copy.heroLabel, title: copy.heroTitle, text: copy.heroText },
  { id: 'security', label: L('СЕТИ И БЕЗОПАСНОСТЬ', 'ЖЕЛІЛЕР ЖӘНЕ ҚАУІПСІЗДІК', 'NETWORKS & SECURITY'),
    title: L(['Связанные системы.', 'Защищённые', 'данные.'], ['Байланысқан жүйелер.', 'Қорғалған', 'деректер.'], ['Connected systems.', 'Protected', 'data.']),
    text: L('Объединяем площадки и пользователей. Проектируем сети, защищаем данные и настраиваем доступ к корпоративным системам.', 'Алаңдар мен пайдаланушыларды біріктіреміз. Желілерді жобалап, деректерді қорғаймыз және корпоративтік жүйелерге қолжетімділікті баптаймыз.', 'Connect your locations and teams. We design networks, protect data and configure access to corporate systems.') },
  { id: 'av', label: L('AV И КОММУНИКАЦИИ', 'AV ЖӘНЕ КОММУНИКАЦИЯЛАР', 'AV & COMMUNICATIONS'),
    title: L(['Пространства', 'для общения', 'и решений.'], ['Қарым-қатынас', 'пен шешімдерге', 'арналған кеңістік.'], ['Spaces to connect.', 'Technology', 'to collaborate.']),
    text: L('Оснащаем конференц-залы, учебные и диспетчерские центры. Объединяем видео, звук и управление в удобную систему.', 'Конференц-залдарды, оқу және диспетчерлік орталықтарды жабдықтаймыз. Бейне, дыбыс пен басқаруды ыңғайлы жүйеге біріктіреміз.', 'Equip conference rooms, learning spaces and control centres. Video, audio and control come together in one intuitive system.') },
] as const;
export const heroControls = {
  region: L('Направления Storex', 'Storex бағыттары', 'Storex expertise'),
  slide: L('Слайд', 'Слайд', 'Slide'),
  pause: L('Приостановить слайды', 'Слайдтарды кідірту', 'Pause slideshow'),
  play: L('Продолжить слайды', 'Слайдтарды жалғастыру', 'Play slideshow'),
};
