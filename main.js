document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector(".gallery");
  const previewImage = document.querySelector(".preview-img img");
  const items = [];
  let currentIndex = 0;
  let angleIncrement;

  function calculateRotation(event) {
    let clientX, clientY;
    if (event.type === "touchmove" || event.type === "touchstart") {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const percentX = (clientX - centerX) / centerX;
    const percentY = (clientY - centerY) / centerY;
    return {
      rotateX: 55 + percentY * 2,
      rotateY: percentX * 2
    };
  }

  function rotateGallery(event) {
    const { rotateX, rotateY } = calculateRotation(event);
    gsap.to(gallery, {
      duration: 1,
      ease: "power2.out",
      rotateX,
      rotateY,
      overwrite: "auto"
    });
  }

  function createGalleryItems() {
    for (let i = 0; i < 150; i++) {
      const item = document.createElement("div");
      item.className = "item";
      const img = document.createElement("img");
      img.src = `./assets/img${(i % 15) + 1}.jpg`;
      item.appendChild(img);
      items.push(item);
      gallery.appendChild(item);
    }
  }

  function setupGalleryItemEvents() {
    angleIncrement = 360 / items.length;

    items.forEach((item, index) => {
      gsap.set(item, {
        rotationY: 90,
        rotationZ: index * angleIncrement - 90,
        transformOrigin: "50% 400px"
      });

      item.addEventListener("mouseover", () => {
        const imgInsideItem = item.querySelector("img");
        previewImage.src = imgInsideItem.src;
        currentIndex = index;
        gsap.to(item, { x: 20, z: 20, y: 20, scale: 1.05, ease: "power2.out", duration: 0.5 });

        items.forEach((otherItem, otherIndex) => {
          if (otherIndex !== index) {
            gsap.to(otherItem, { x: 0, y: 0, z: 0, scale: 1, ease: "power2.out", duration: 0.5 });
          }
        });
      });

      item.addEventListener("mouseout", () => {
        if (currentIndex !== index) {
          previewImage.src = "./assets/img1.jpg";
          gsap.to(item, { x: 0, y: 0, z: 0, ease: "power2.out", duration: 0.5 });
        }
      });
    });
  }

  function setupRotation() {
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 2,
      onUpdate: (self) => {
        const rotationProgress = self.progress * 360 * 1;
        items.forEach((item, index) => {
          const currentAngle = index * angleIncrement - 90 + rotationProgress;
          gsap.to(item, {
            rotationZ: currentAngle,
            duration: 1,
            ease: "power3.out",
            overwrite: "auto"
          });
        });
      }
    });
  }

  function changeImageOnScroll(event) {
    const delta = Math.sign(event.deltaY);
    currentIndex += delta;
  
    if (currentIndex < 0) {
      currentIndex = items.length - 1; 
    } else if (currentIndex >= items.length) {
      currentIndex = 0; 
    }
  
    const imgInsideItem = items[currentIndex].querySelector("img");
    previewImage.src = imgInsideItem.src;
  
    gsap.to(items[currentIndex], {
      x: 20,
      z: 20,
      y: 20,
      scale: 1.05,
      ease: "power2.out",
      duration: 0.5
    });
  
    items.forEach((item, index) => {
      if (index !== currentIndex) {
        gsap.to(item, {
          x: 0,
          y: 0,
          z: 0,
          scale: 1,
          ease: "power2.out",
          duration: 0.5
        });
      }
    });
  }

  function animateGallery() {
    const tl = gsap.timeline();

    tl.from(".item", { duration: 1, opacity: 0, stagger: 0.03, ease: "power2.out" })
      .from(".preview-img", { duration: 1, opacity: 0, ease: "power2.out" })
      .from("p", { duration: 1, stagger: 0.25, opacity: 0, ease: "power2.out" });

    return tl;
  }

  createGalleryItems();
  setupGalleryItemEvents();
  setupRotation();
  animateGallery()

  document.addEventListener("mousemove", rotateGallery);
  document.addEventListener("touchmove", rotateGallery);
  document.addEventListener("wheel", changeImageOnScroll);
});