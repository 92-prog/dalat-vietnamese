import type { Phrase, Scene } from '../types'
import greet from './greet'
import numbers from './numbers'
import cafe from './cafe'
import food from './food'
import market from './market'
import ride from './ride'
import motorbike from './motorbike'
import housing from './housing'
import grocery from './grocery'
import services from './services'
import health from './health'
import weather from './weather'
import neighbors from './neighbors'
import emergency from './emergency'

export const SCENES: Scene[] = [greet, numbers, cafe, food, market, ride, motorbike, housing, grocery, services, health, weather, neighbors, emergency]

export const SCENE_BY_ID: Record<string, Scene> = Object.fromEntries(SCENES.map((s) => [s.id, s]))

export const PHRASE_BY_ID: Record<string, Phrase & { sceneId: string }> = Object.fromEntries(
  SCENES.flatMap((s) => s.phrases.map((p) => [p.id, { ...p, sceneId: s.id }])),
)
