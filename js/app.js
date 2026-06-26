async function cargarPagina(pagina, desdeHistorial = false) {
    try {
        const respuesta = await fetch(`pages/${pagina}.html`);
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
        const contenido = await respuesta.text();
        document.getElementById("contenido").innerHTML = contenido;

        const imagen = document.getElementById("imagen-principal");
        if (imagen) {
            imagen.style.display = pagina === "tech" ? "none" : "block";
        }
        document.querySelectorAll(".nav a[data-page]").forEach(link => {
            link.classList.remove("active");
        });
        const activo = document.querySelector(`[data-page="${pagina}"]`);
        if (activo) {
            activo.classList.add("active");
        }

        if (!desdeHistorial) {
            const estadoActual = history.state;
            if (!estadoActual || estadoActual.pagina !== pagina) {
                history.pushState({ pagina }, "", `#${pagina}`);
            }
        }

    } catch (error) {
        console.error("Error al cargar la página:", error);
        document.getElementById("contenido").innerHTML =
            `<p style="color:var(--danger);text-align:center;padding:2rem;">
                Error al cargar "${pagina}". Intenta de nuevo.
            </p>`;
    }
}
document.addEventListener("DOMContentLoaded", function() {
    const paginaInicial = window.location.hash.replace("#", "") || "home";
    history.replaceState({ pagina: paginaInicial }, "", window.location.hash || "");
    cargarPagina(paginaInicial);

    window.addEventListener("popstate", function(e) {
        if (e.state && e.state.pagina) {
            cargarPagina(e.state.pagina, true);
        }
    });

    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.getElementById("nav-menu");

    function toggleMenu() {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("open");
        hamburger.setAttribute("aria-expanded", navMenu.classList.contains("open"));
    }

    function closeMenu() {
        hamburger.classList.remove("active");
        navMenu.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
    }

    hamburger.addEventListener("click", toggleMenu);

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });
    document.querySelector(".nav .me")?.addEventListener("click", closeMenu);

    document.addEventListener("click", function(e) {
        if (!e.target.closest(".nav") && navMenu.classList.contains("open")) {
            closeMenu();
        }
    });
});