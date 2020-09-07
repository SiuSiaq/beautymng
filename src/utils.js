export const formatTime = (hours, minutes) => {
    let displayTime = "";
    if(hours > 0) {
        if(hours === 1) displayTime += "1 godzina ";
        else displayTime += `${hours} godziny `;
    }
    if(minutes > 0) {
        if(minutes === 1) displayTime += "1 minuta ";
        else if(minutes  %10 === 2 || minutes  %10 === 3) displayTime += `${minutes} minuty`;
    }
};
