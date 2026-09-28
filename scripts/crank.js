export class Crank {
    constructor(crankHandle) {
        this.crank = crankHandle;
        this.currentAngle = 0;

        // probably will have 8 max rotations
        this.amountCranked = 0; // whenever moving, figure out the difference between angles (in whichever direction has less difference) then add to this

        this.crank.onmousedown = (e) => { this.#draggingCrank(e) };
    }


    #draggingCrank(e) {

        e.preventDefault();
        // Get the position that the anchor rotates around
        const [anchorX, anchorY] = getCrankAnchor(this.crank);

        document.onmousemove = (e) => {
            const x = e.clientX - anchorX;
            const y = e.clientY - anchorY;

            const rotation = Math.atan2(y, x); // in radians. atan2 avoids issues with quadrants that atan can cause

            // update rotation change
            const angleDiff = rotation - this.currentAngle;
            const angleChange = mod(angleDiff + Math.PI, Math.PI * 2) - Math.PI;
            this.amountCranked += angleChange / (2 * Math.PI);

            this.crank.style.transform = `rotate(${rotation}rad)`;
            this.currentAngle = rotation;
        };
        // When mouse is released stop updating
        document.onmouseup = (_) => {
            document.onmousemove = null;
            document.onmouseup = null;
        }

        function getCrankAnchor(crank) {
            // Temporarily reset the rotation so that we can get the proper rect position
            const rotation = crank.style.transform;
            crank.style.transform = "rotate(0)";

            // Get the rect position
            const rect = crank.getBoundingClientRect();

            // Return to the original rotation
            crank.style.transform = rotation;

            // Offset to get the actual anchor coords
            const x = rect.left + 25;
            const y = ((rect.top + rect.bottom) / 2);
            return [x, y];
        }
    }
}

// uses an answer from this post: https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
// js hates me and made the modulo operator actually calculate remainder (which messes it up with negatives)
function mod(n, m) {
    return ((n % m) + m) % m;
}