const scrollers = document.querySelectorAll(".slider");
scrollers.forEach((scroller) => {
    const scrollerContent = Array.from(scroller.children);

    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scroller.appendChild(duplicatedItem);
    });
});