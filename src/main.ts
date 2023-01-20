import { createApp } from "vue";
import App from "./App.vue";
import "./styles/style.scss";

const app = createApp(App);
const modules = import.meta.glob<any>("/src/modules/*.ts", { eager: true });
// install all modules under `modules/`
Object.values(modules).forEach((module: any) => module.install?.(app));

app.mount("#app");
