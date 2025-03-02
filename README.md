# Tempora - Stránka pro tvorbu interaktivních časových os

Webové stránka sloužící jako nástroj pro tvorbu a vizualizaci interaktivních časových os. Cílem práce bylo umožnit uživatelům tvorbu, procházení a sdílení časových os s možností jejich rozkliknutí pro podrobnější informace o jednotlivých obdobích a autorech. Tyto osy se vyznačují důrazem na zasazení událostí do historického kontextu a umožňují srovnání dvou tématicky odlišných období.

 <img src="assets/images/TemporaLogo_big.png" width="40" alt="Logo Tempora ">



## ✨ Features

- 📅 Interactive timeline visualization
- 📖 Literature and historical events integration
- 🌍 Context-aware event relationships
- 🎨 Customizable timeline appearance
- 👥 Multi-user collaboration
- 🔖 Bookmark system
- 🌓 Dark/Light mode support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 📦
- Supabase account 🗃️
- Git 🔄

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/tempora.git
cd tempora
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:
```env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

4. Start development server
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 🛠️ Built With

- [Nuxt 3](https://nuxt.com/) - Vue Framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vue Timeline Chart](https://github.com/grocky/vue-timeline-chart) - Timeline Visualization
- [Nuxt UI](https://ui.nuxt.com/) - UI Components
- [TailwindCSS](https://tailwindcss.com/) - Styling

## 📸 Screenshots

### Časová osa

<img src="assets/images/lit.png" width="700" alt="Časová osa">

### Editace události

<img src="assets/images/EditItem.png" width="700" alt="Editace události">

### Detail události

<img src="assets/images/showItem.png" width="700" alt="Detail události">

## 📝 Použití

- //TODO tohle lip vysvetlit

1. **Create Timeline**
   - Click "New Timeline"
   - Set timeline parameters
   - Add initial events

2. **Add Events**
   - Use the sidebar "+" button
   - Fill in event details
   - Set time period and category

3. **Navigate**
   - Zoom with Ctrl + Mouse Wheel
   - Drag timeline to move
   - Click events for details
  
📄 Pro více informací se podívejte do [Dokumentace](https://github.com/gyarab/2024-4e-petrik-Tempora/dokumentace.pdf)
<!---
## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
-->
