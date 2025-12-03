import { Injectable } from '@nestjs/common';
import { IPokemonResponse } from './interfaces/pokemon-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pm: Model<Pokemon>,
    private readonly axiosAdapter: AxiosAdapter
  ) { }

  async executeSeed() {
    await this.pm.deleteMany();

    const pr = await this.axiosAdapter.get<IPokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    const pokemonToInsert: { name: string, no: number }[] = [];

    pr.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no });
    });

    await this.pm.insertMany(pokemonToInsert);

    return 'Seed executed';
  }
}
