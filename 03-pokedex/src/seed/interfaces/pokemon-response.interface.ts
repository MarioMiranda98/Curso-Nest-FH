export interface IPokemonResponse {
  count: number;
  next: string | undefined | null;
  previous: string | undefined | null;
  results: Results[];
}

interface Results {
  name: string;
  url: string;
}