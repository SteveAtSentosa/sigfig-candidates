export const colors = [
  '#f68e7e',
  '#ffac9B',
  '#ffae4f',
  '#82e59f',
  '#66d587',
];

export const getScoreColor = score => colors[Math.ceil((score - 1) / 0.8) - 1];

export const getENPSColor = (value) => {
  if (value < -70) {
    return colors[0];
  }

  if (value < -30) {
    return colors[2];
  }

  if (value < 40) {
    return colors[3];
  }

  return colors[4];
};

export const getParticipationRateColor = percentage => colors[Math.ceil(percentage / 20) - 1];

export const rgba = (hex) => {
  const alpha = parseFloat(
    (parseInt(`${hex[7]}${hex[8]}`, 16) / 255).toFixed(2),
  );
  const red = parseInt(`${hex[1]}${hex[2]}`, 16);
  const green = parseInt(`${hex[3]}${hex[4]}`, 16);
  const blue = parseInt(`${hex[5]}${hex[6]}`, 16);

  return `rgba(${red},${green}, ${blue}, ${alpha})`;
};
