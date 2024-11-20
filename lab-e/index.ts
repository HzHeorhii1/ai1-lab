interface Style {
    name: string;
    path: string;
}

class StyleSwitcher {
    private styles: Record<string, Style> = {
        st1: { name: "style1.css", path: "./styles/index1.css" },
        st2: { name: "style2.css", path: "./styles/index2.css" },
        st3: { name: "style3.css", path: "./styles/index3.css" },
    };

    private currentStyle: string = "style1.css";

    constructor() {
        this.init();
    }

    private init() {
        this.createSwitcherButtons();
    }

    private switchStyle(styleKey: string): void {
        const styleElement = document.getElementById("page-style") as HTMLLinkElement;

        if (this.styles[styleKey]) {
            styleElement.href = this.styles[styleKey].path;
            this.currentStyle = styleKey;
        } else {
            console.error(`Style "${styleKey}" not found.`);
        }
    }

    private createSwitcherButtons(): void {
        const container = document.querySelector(".switcher");
        if (!container) { return ; }
        container.innerHTML = "";

        for (const key in this.styles) {
            const button = document.createElement("button");
            button.textContent = `style ${this.styles[key].name}`;
            button.classList.add("switch-button");

            button.addEventListener("click", () => this.switchStyle(key));
            container.appendChild(button);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new StyleSwitcher();
});
