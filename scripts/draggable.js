export function makeDraggable(element, startX, startY, limitingParent = false, dragCutout = false) {
    let isDown = false;

    let x = startX;
    let y = startY;
    updatePos(startX, startY);

    // Keeps track of the mouse position for last frame
    let prevX;
    let prevY;

    // Mouse events
    element.addEventListener("mousedown", function (e) {
        // dragCutout is the area cut out of the overall draggable area of this element.
        if (dragCutout) {
            const left = e.clientX >= dragCutout.getBoundingClientRect().left;
            const right = e.clientX <= dragCutout.getBoundingClientRect().right;
            const top = e.clientY >= dragCutout.getBoundingClientRect().top;
            const bottom = e.clientY <= dragCutout.getBoundingClientRect().bottom;
            if (left && right && top && bottom) {
                return;
            }
        }

        isDown = true;
        prevX = e.clientX;
        prevY = e.clientY;

        // Make sure other things don't use this
        e.preventDefault();
        e.stopPropagation();
    }, true);
    element.addEventListener("mouseup", function (_) { isDown = false });
    element.addEventListener("mouseleave", function (_) { isDown = false });
    element.addEventListener("mousemove", function (e) {
        if (!isDown) return;

        // limitingParent is a reference to the parent that when set means that the draggable object shouldn't be able to move out of its bounds.
        if (limitingParent) {
            const deltaX = e.clientX - prevX;
            const deltaY = e.clientY - prevY;
            prevX = e.clientX;
            prevY = e.clientY;

            // Clamp to the bounds of the parent element
            const limitedX = Math.max(0, x + deltaX);
            const limitedY = Math.max(0, y + deltaY);
            const limitedX2 = Math.min(limitedX + element.clientWidth, limitingParent.clientWidth) - element.clientWidth;
            const limitedY2 = Math.min(limitedY + element.clientHeight, limitingParent.clientHeight) - element.clientHeight;
            updatePos(limitedX2, limitedY2);
        }
        else {
            const deltaX = e.clientX - prevX;
            const deltaY = e.clientY - prevY;
            prevX = e.clientX;
            prevY = e.clientY;
            updatePos(x + deltaX, y + deltaY);
        }
    }, true)

    // Returns the original element for the sake of convenience
    return element;

    function updatePos(newX, newY) {
        x = newX;
        y = newY;
        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;
    }
}
