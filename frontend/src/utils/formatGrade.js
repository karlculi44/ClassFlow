function formatGrade(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "-";
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return "-";
  }

  const [wholePart, decimalPart] = String(numericValue).split(".");
  return decimalPart ? `${wholePart}.${decimalPart[0]}` : wholePart;
}

export default formatGrade;
