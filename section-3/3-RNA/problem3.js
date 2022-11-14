const START_CODON = "AUG";
const STOP_CODONS = ["UAA", "UGA", "UAG"];
const MAPPINGS = {
  "alanine": ["GCU", "GCC", "GCA", "GCG"],
  "arginine": ["CGT", "CGC", "CGA", "CGG", "AGA", "AGG"],
  "asparagine": ["AAU", "AAC"],
  "aspartic acid": ["GAU", "GAC"],
  "cysteine": ["UGU", "UGC"],
  "glutamine": ["CAA", "CAG"],
  "glutamic acid": ["GAA", "GAG"],
  "glycine": ["GGU", "GGC", "GGA", "GGG"],
  "histidine": ["CAU", "CAC"],
  "isoleucine": ["AUU", "AUC", "AUA"],
  "leucine": ["UUA", "UUG", "CUU", "CUC", "CUA", "CUG"],
  "lysine": ["AAA", "AAG"],
  "methionine": ["AUG"],
  "phenylalanine": ["UUU", "UUC"],
  "proline": ["CCU", "CCC", "CCA", "CCG"],
  "serine": ["UCU", "UCC", "UCA", "UCG", "AGU", "AGC"],
  "threonine": ["ACU", "ACC", "ACA", "ACG"],
  "tryptophan": ["UGG"],
  "tyrosine": ["UAU", "UAC"],
  "valine": ["GUU", "GUC", "GUA", "GUG"],
};

/**
 * Write a function that, given the particular gene (e.g. "alanine",
 * "glycine", etc), and a sequence (e.g. "AUGGCUUAA"), determines if the
 * sequence is valid for the given gene.
 */
function mappingIsValid(gene, sequence) {
  if (gene.length !== (3*sequence.length) + 6) {
    return false;
  }
  let accurate = true;
  let checkSequence = [];
  let start = gene.substring(0,3);
  let end = gene.substring(gene.length-3, gene.length);
  let middleCodons = [];

  if (start !== START_CODON){
    return false;
  }
  if (STOP_CODONS.indexOf(end) {
    return false;
  }

  for (let i = 0; i < sequence.length; i++) {
    let currentCodon = gene.substring((3 * i + 1), (3 * i + 3));
    if (MAPPINGS[sequence[i]].indexOf(currentCodon) !== -1) {
      return false;
    }
  }
}