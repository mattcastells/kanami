// GENERADO — no editar a mano.
// Fuentes: content/clases/kurasu-NN.md · content/repaso.md
// Regenerar con: npm run clases:generate
//
// Los apuntes de clase son la transcripción de las clases reales (Notion 日本語 | Nihongo
// > Clases) y la hoja de repaso es su resumen consolidado. Editá el markdown y volvé a
// correr el script; nunca este archivo.

import { ClassNote } from '../types/classNotes';

export const CLASS_NOTES: ClassNote[] = [
  {
    "id": "kurasu-01",
    "number": 1,
    "title": "はじめまして！ Presentación e introducción al japonés",
    "date": "2026-03-07",
    "topics": "palabras del aula, historia del idioma, sistemas de escritura, sintaxis SOV, partículas (intro), pronombres y honoríficos, presentarse, países, profesiones, hobbies, frases esenciales.",
    "sections": [
      {
        "id": "palabras-del-aula",
        "title": "Palabras del aula",
        "titleJp": "クラスのことば",
        "blocks": [
          {
            "kind": "subheading",
            "text": "Antes de la clase | クラスのまえ"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "しつれいします",
                "Shitsurei shimasu",
                "Con permiso"
              ],
              [
                "どうぞ",
                "Douzo",
                "Adelante"
              ],
              [
                "きりつ",
                "Kiritsu",
                "De pie"
              ],
              [
                "おはようございます",
                "Ohayou gozaimasu",
                "Buenos días"
              ],
              [
                "はじめましょう",
                "Hajimemashou",
                "¡Empecemos!"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "Durante la clase | クラスちゅう"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "きゅうけいしましょう",
                "Kyuukei shimashou",
                "¡Tengamos un recreo!"
              ],
              [
                "おわりましょう",
                "Owarimashou",
                "¡Terminemos!"
              ],
              [
                "しつもんがありますか？",
                "Shitsumon ga arimasu ka?",
                "¿Alguna pregunta?"
              ],
              [
                "はい、あります。",
                "Hai, arimasu.",
                "Sí, tengo una pregunta."
              ],
              [
                "いいえ、ありません。",
                "Iie, arimasen.",
                "No, no tengo."
              ],
              [
                "すみません、しつもんです。",
                "Sumimasen, shitsumon desu.",
                "Perdón, tengo una pregunta."
              ],
              [
                "はい、どうぞ。",
                "Hai, douzo.",
                "Adelante."
              ],
              [
                "わかりましたか？",
                "Wakarimashita ka?",
                "¿Se entendió?"
              ],
              [
                "はい、わかりました。",
                "Hai, wakarimashita.",
                "Sí, entendí."
              ],
              [
                "わかりません。",
                "Wakarimasen.",
                "No entiendo."
              ],
              [
                "よんでください",
                "Yonde kudasai",
                "Lee por favor."
              ],
              [
                "きいてください",
                "Kiite kudasai",
                "Escuchen por favor."
              ],
              [
                "こたえてください",
                "Kotaete kudasai",
                "Respondan por favor."
              ],
              [
                "もういちどおねがいします",
                "Mou ichido onegaishimasu",
                "¿Podrías repetirlo?"
              ],
              [
                "しゅくだい",
                "Shukudai",
                "Tarea"
              ],
              [
                "しけん／テスト",
                "Shiken / Tesuto",
                "Examen"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "Después de la clase | クラスのあと"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "きりつ",
                "Kiritsu",
                "De pie"
              ],
              [
                "おつかれさまでした。",
                "Otsukaresama deshita.",
                "Buen trabajo el de hoy."
              ],
              [
                "ありがとうございます。",
                "Arigatou gozaimasu.",
                "Muchas gracias."
              ],
              [
                "またらいしゅう。さようなら。",
                "Mata raishuu. Sayounara.",
                "Hasta la semana que viene. Adiós."
              ]
            ]
          }
        ]
      },
      {
        "id": "historia-del-idioma-japones",
        "title": "Historia del idioma japonés",
        "blocks": [
          {
            "kind": "text",
            "text": "Antes del período Heian (794–1185), el japonés era únicamente un idioma hablado. Con la llegada de monjes budistas chinos, Japón tomó prestados los caracteres chinos (漢字) para poder escribir."
          },
          {
            "kind": "list",
            "items": [
              "**Período Heian (794–1185):** los caracteres chinos usados solo por su sonido se simplificaron hasta convertirse en ひらがな (Hiragana). Los usados por su significado se llamaron 漢字 (Kanji).",
              "**Período Edo (1603–1868):** los caracteres angulosos se usaron para escribir sonidos de manera estructurada, dando origen al カタカナ (Katakana).",
              "**Período Meiji (1868–1912):** con la apertura a occidente entraron muchas palabras extranjeras; sus sonidos se japonizaron y se escriben en Katakana."
            ]
          }
        ]
      },
      {
        "id": "los-4-sistemas-de-escritura",
        "title": "Los 4 sistemas de escritura",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Sistema",
              "Caracteres",
              "Para qué se usa"
            ],
            "rows": [
              [
                "ひらがな Hiragana",
                "Formas redondeadas",
                "Palabras japonesas, conectores, partículas"
              ],
              [
                "カタカナ Katakana",
                "Formas angulosas",
                "Palabras extranjeras y onomatopeyas"
              ],
              [
                "漢字 Kanji",
                "Ideogramas de origen chino",
                "Sustantivos, verbos, adjetivos con significado propio"
              ],
              [
                "ローマ字 Romaji",
                "Alfabeto latino",
                "Transcribir el japonés"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "Los Kanji tienen dos o más lecturas según contexto. Cada uno representa una idea, no un sonido."
          }
        ]
      },
      {
        "id": "sintaxis-sujeto-objeto-verbo",
        "title": "Sintaxis: Sujeto-Objeto-Verbo",
        "blocks": [
          {
            "kind": "text",
            "text": "Español: Sujeto → Verbo → Objeto. Japonés: **Sujeto → Objeto → Verbo**; el verbo siempre va al final."
          },
          {
            "kind": "quote",
            "lines": [
              "たなかさん は にほんじん です。 (Tanaka-san wa nihonjin desu.) — La señora Tanaka es japonesa.",
              "フアンくん は ともだちと きんようびに がっこうで べんきょうします。 — Juan estudia con su amigo en el colegio el viernes."
            ]
          }
        ]
      },
      {
        "id": "las-particulas",
        "title": "Las partículas",
        "blocks": [
          {
            "kind": "text",
            "text": "Reemplazan preposiciones, artículos y auxiliares del español. Van **después** de la palabra a la que refieren y ordenan la oración."
          }
        ]
      },
      {
        "id": "pronombres-personales-y-honorificos",
        "title": "Pronombres personales y honoríficos",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "わたし",
                "Watashi",
                "Yo"
              ],
              [
                "わたしたち",
                "Watashitachi",
                "Nosotros"
              ],
              [
                "あなた",
                "Anata",
                "Usted / Vos"
              ],
              [
                "あなたたち",
                "Anatatachi",
                "Ustedes"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "Honoríficos (van después del apellido):"
          },
          {
            "kind": "table",
            "headers": [
              "Honorífico",
              "Uso"
            ],
            "rows": [
              [
                "～さま sama",
                "Máximo respeto. Contexto laboral formal."
              ],
              [
                "～さん san",
                "Respeto general. Personas que no conocemos."
              ],
              [
                "～くん kun",
                "Respeto moderado. Chicos/hombres de confianza."
              ],
              [
                "～ちゃん chan",
                "Muy familiar. Menores, amigas cercanas, mascotas."
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "Primero el apellido, luego el nombre. NUNCA usar honoríficos para uno mismo ni con あなた."
          }
        ]
      },
      {
        "id": "presentarse",
        "title": "Presentarse",
        "titleJp": "わたしは～です",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "わたし は [nombre] です。 (Watashi wa [nombre] desu.) — Yo soy [nombre]."
            ]
          },
          {
            "kind": "list",
            "items": [
              "おなまえは？ Onamae wa? — ¿Cómo te llamás?",
              "おくには？ Okuni wa? — ¿De qué país sos?",
              "おしごとは？ Oshigoto wa? — ¿A qué te dedicás?",
              "ごしゅみは？ Go shumi wa? — ¿Cuál es tu hobby?"
            ]
          }
        ]
      },
      {
        "id": "paises",
        "title": "Países",
        "titleJp": "くに + じん",
        "blocks": [
          {
            "kind": "text",
            "text": "Nacionalidad = país + じん"
          },
          {
            "kind": "table",
            "headers": [
              "País",
              "Japonés",
              "Romaji",
              "Nacionalidad"
            ],
            "rows": [
              [
                "Japón",
                "にほん",
                "Nihon",
                "にほんじん"
              ],
              [
                "Argentina",
                "アルゼンチン",
                "Aruzenchin",
                "アルゼンチンじん"
              ],
              [
                "China",
                "ちゅうごく",
                "Chuugoku",
                "ちゅうごくじん"
              ],
              [
                "Corea",
                "かんこく",
                "Kankoku",
                "かんこくじん"
              ],
              [
                "Brasil",
                "ブラジル",
                "Burajiru",
                "ブラジルじん"
              ],
              [
                "EE.UU.",
                "アメリカ",
                "Amerika",
                "アメリカじん"
              ],
              [
                "Inglaterra",
                "イギリス",
                "Igirisu",
                "イギリスじん"
              ],
              [
                "Francia",
                "フランス",
                "Furansu",
                "フランスじん"
              ],
              [
                "España",
                "スパイン",
                "Supein",
                "スパインじん"
              ],
              [
                "Italia",
                "イタリア",
                "Itaria",
                "イタリアじん"
              ],
              [
                "Australia",
                "オーストラリア",
                "Oosutoraria",
                "オーストラリアじん"
              ],
              [
                "México",
                "メキシコ",
                "Mekishiko",
                "メキシコじん"
              ],
              [
                "Perú",
                "ペルー",
                "Peruu",
                "ペルーじん"
              ],
              [
                "Chile",
                "チリ",
                "Chiri",
                "チリじん"
              ],
              [
                "Venezuela",
                "ベネズエラ",
                "Benezuera",
                "ベネズエラじん"
              ],
              [
                "India",
                "インド",
                "Indo",
                "インドじん"
              ],
              [
                "Vietnam",
                "ベトナム",
                "Betonamu",
                "ベトナムじん"
              ]
            ]
          }
        ]
      },
      {
        "id": "profesiones",
        "title": "Profesiones",
        "titleJp": "おしごと",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "せんせい／きょうし",
                "Sensei / Kyoushi",
                "Profesor/a"
              ],
              [
                "がくせい",
                "Gakusei",
                "Alumno/a"
              ],
              [
                "かいしゃいん",
                "Kaishain",
                "Empleado de empresa"
              ],
              [
                "ぎんこういん",
                "Ginkooin",
                "Banquero/a"
              ],
              [
                "いしゃ",
                "Isha",
                "Doctor/a"
              ],
              [
                "けんきゅうしゃ",
                "Kenkyuusha",
                "Investigador/a"
              ],
              [
                "エンジニア",
                "Enjinia",
                "Ingeniero/a"
              ],
              [
                "べんごし",
                "Bengoshi",
                "Abogado/a"
              ],
              [
                "しゃいん",
                "Shain",
                "Empleado/a"
              ],
              [
                "はいゆう",
                "Haiyuu",
                "Actor/Actriz"
              ]
            ]
          }
        ]
      },
      {
        "id": "hobbies",
        "title": "Hobbies",
        "titleJp": "ごしゅみ",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "スポーツ",
                "Supootsu",
                "Deportes"
              ],
              [
                "どくしょ",
                "Dokusho",
                "Lectura"
              ],
              [
                "りょこう",
                "Ryokoo",
                "Viajes"
              ],
              [
                "え",
                "E",
                "Dibujo/Pintura"
              ],
              [
                "しゃしん",
                "Shashin",
                "Fotografía"
              ],
              [
                "えいが",
                "Eiga",
                "Películas"
              ],
              [
                "おんがく",
                "Ongaku",
                "Música"
              ],
              [
                "りょうり",
                "Ryoori",
                "Cocinar"
              ],
              [
                "ゲーム",
                "Geemu",
                "Videojuegos"
              ],
              [
                "ピアノ",
                "Piano",
                "Piano"
              ]
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "はじめまして！",
                "Hajimemashite!",
                "¡Mucho gusto! (primer encuentro)"
              ],
              [
                "わたし は ～ です。",
                "Watashi wa ~ desu.",
                "Yo soy ~."
              ],
              [
                "おなまえは？",
                "Onamae wa?",
                "¿Cómo te llamás?"
              ],
              [
                "おくには？",
                "Okuni wa?",
                "¿De qué país sos?"
              ],
              [
                "おしごとは？",
                "Oshigoto wa?",
                "¿A qué te dedicás?"
              ],
              [
                "ごしゅみは？",
                "Go shumi wa?",
                "¿Cuál es tu hobby?"
              ],
              [
                "どうぞよろしくおねがいします。",
                "Douzo yoroshiku onegai shimasu.",
                "Encantado/a (cierre formal)"
              ],
              [
                "よろしくおねがいします！",
                "Yoroshiku onegaishimasu!",
                "¡Encantado/a! (informal)"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-02",
    "number": 2,
    "title": "Hiragana completo, tenten, maru y partículas か・も",
    "date": "2026-03-14",
    "topics": "hiragana completo, tenten/maru, っ chiquito, combinaciones (kya kyu kyo), vocales largas, partícula か, partícula も, demostrativos この/その/あの, formal vs informal.",
    "sections": [
      {
        "id": "hiragana-variantes-sonoras",
        "title": "Hiragana — variantes sonoras",
        "blocks": [
          {
            "kind": "subheading",
            "text": "Fila KA + tenten"
          },
          {
            "kind": "text",
            "text": "か→が(ga), き→ぎ(gi), く→ぐ(gu), け→げ(ge), こ→ご(go) — K → G"
          },
          {
            "kind": "subheading",
            "text": "Fila SA + tenten"
          },
          {
            "kind": "text",
            "text": "さ→ざ(za), し→じ(ji), す→ず(zu), せ→ぜ(ze), そ→ぞ(zo) — S → Z"
          },
          {
            "kind": "subheading",
            "text": "Fila TA + tenten"
          },
          {
            "kind": "text",
            "text": "た→だ(da), ち→ぢ(ji), つ→づ(dzu), て→で(de), と→ど(do) — T → D"
          },
          {
            "kind": "subheading",
            "text": "Filas sin variantes"
          },
          {
            "kind": "table",
            "headers": [
              "Fila",
              "Sílabas"
            ],
            "rows": [
              [
                "NA",
                "な に ぬ ね の"
              ],
              [
                "MA",
                "ま み む め も"
              ],
              [
                "YA",
                "や ゆ よ"
              ],
              [
                "RA",
                "ら り る れ ろ"
              ],
              [
                "WA / N",
                "わ を ん"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "Fila HA — tenten y maru"
          },
          {
            "kind": "table",
            "headers": [
              "Base",
              "Tenten (゛)",
              "Maru (゚)"
            ],
            "rows": [
              [
                "は ha",
                "ば ba",
                "ぱ pa"
              ],
              [
                "ひ hi",
                "び bi",
                "ぴ pi"
              ],
              [
                "ふ fu",
                "ぶ bu",
                "ぷ pu"
              ],
              [
                "へ he",
                "べ be",
                "ぺ pe"
              ],
              [
                "ほ ho",
                "ぼ bo",
                "ぽ po"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "El tenten (゛) cambia la consonante a su versión sonora. El maru (゚) se usa solo en la fila HA para los sonidos P."
          }
        ]
      },
      {
        "id": "chiquito",
        "title": "っ Chiquito",
        "titleJp": "ちいさい「つ」",
        "blocks": [
          {
            "kind": "text",
            "text": "Duplica la consonante que le sigue; se pronuncia como una pausa/golpe."
          },
          {
            "kind": "table",
            "headers": [
              "Sin っ",
              "Con っ",
              "Español"
            ],
            "rows": [
              [
                "きて kite",
                "きって kitte",
                "Vení / Estampilla"
              ],
              [
                "おと oto",
                "おっと otto",
                "Sonido / Esposo"
              ],
              [
                "ぶか buka",
                "ぶっか bukka",
                "Subordinado / Precio"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "Solo aparece antes de K, S, T, P:"
          },
          {
            "kind": "table",
            "headers": [
              "Comb.",
              "Ejemplo",
              "Significado"
            ],
            "rows": [
              [
                "っ+k",
                "にっき nikki",
                "Diario íntimo"
              ],
              [
                "っ+s",
                "ざっし zasshi",
                "Revista"
              ],
              [
                "っ+t",
                "ちょっと chotto",
                "Un momento"
              ],
              [
                "っ+p",
                "きっぷ kippu",
                "Boleto/Ticket"
              ]
            ]
          }
        ]
      },
      {
        "id": "combinaciones",
        "title": "Combinaciones",
        "titleJp": "きゃきゅきょ",
        "blocks": [
          {
            "kind": "text",
            "text": "Sílabas terminadas en い + や/ゆ/よ pequeños:"
          },
          {
            "kind": "table",
            "headers": [
              "Comb.",
              "Ejemplo",
              "Significado"
            ],
            "rows": [
              [
                "き+ょ",
                "きょうし kyoushi",
                "Profesor"
              ],
              [
                "び+ょ",
                "びょういん byouin",
                "Hospital"
              ],
              [
                "び+よ",
                "びよういん biyouin",
                "Peluquería"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "びょういん (hospital) vs びよういん (peluquería): la diferencia es si la よ es chica o grande."
          }
        ]
      },
      {
        "id": "vocales-largas",
        "title": "Vocales largas",
        "blocks": [
          {
            "kind": "subheading",
            "text": "E + I → E larga"
          },
          {
            "kind": "text",
            "text": "せんせい→Sensee, きれい→Kiree, えいご→Eego, せいかつ→Seekatsu (estilo de vida)"
          },
          {
            "kind": "subheading",
            "text": "O + U → O larga"
          },
          {
            "kind": "text",
            "text": "こうこう→Kookoo (secundaria), きょうと→Kyooto, とうきょう→Tookyoo, さようなら→Sayoonara, ありがとう→Arigatoo"
          }
        ]
      },
      {
        "id": "particula-preguntas",
        "title": "Partícula か — preguntas",
        "blocks": [
          {
            "kind": "text",
            "text": "Va al final de la oración; equivale a ¿?."
          },
          {
            "kind": "quote",
            "lines": [
              "きょうこさん は がくせい ですか？ — ¿Kyouko es alumna?",
              "はい、がくせい です。 — Sí, es alumna.",
              "いいえ、がくせい じゃありません。 — No, no es alumna."
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "Si el sujeto ya está en la pregunta, no se repite en la respuesta."
          }
        ]
      },
      {
        "id": "particula-tambien-tampoco",
        "title": "Partícula も — también / tampoco",
        "blocks": [
          {
            "kind": "text",
            "text": "も reemplaza a は cuando significa \"también\" (positiva) o \"tampoco\" (negativa)."
          },
          {
            "kind": "quote",
            "lines": [
              "トビー・マグワイアさん は スパイダーマン の はいゆう です。 — Tobey Maguire es el actor de Spiderman.",
              "アンドリュー ガーフィールドさん も スパイダーマン の はいゆう です。 — Andrew Garfield también."
            ]
          },
          {
            "kind": "text",
            "text": "En preguntas con も: respuesta positiva → se mantiene も; respuesta negativa → も se reemplaza por は + じゃありません."
          }
        ]
      },
      {
        "id": "demostrativos",
        "title": "Demostrativos この・その・あの",
        "blocks": [
          {
            "kind": "text",
            "text": "Adjetivos demostrativos: siempre seguidos de un sustantivo."
          },
          {
            "kind": "table",
            "headers": [
              "Dem.",
              "Romaji",
              "Uso"
            ],
            "rows": [
              [
                "この",
                "kono",
                "Cerca del hablante"
              ],
              [
                "その",
                "sono",
                "Cerca del oyente"
              ],
              [
                "あの",
                "ano",
                "Lejos de ambos"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "この ひと は だれ ですか？ — ¿Quién es esta persona?",
              "その ひと は アルゼンチンじん で、サッカーせんしゅう です。 — Esa persona es argentina y jugadora de fútbol."
            ]
          }
        ]
      },
      {
        "id": "formal-vs-informal",
        "title": "Formal vs. Informal",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Informal",
              "Formal",
              "Significado"
            ],
            "rows": [
              [
                "ひと hito",
                "かた kata",
                "Persona"
              ],
              [
                "だれ dare",
                "どなた donata",
                "¿Quién?"
              ]
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "～さん は ～ ですか？",
                "~-san wa ~ desu ka?",
                "¿Es ~ ~?"
              ],
              [
                "はい、～ です。",
                "Hai, ~ desu.",
                "Sí, es ~."
              ],
              [
                "いいえ、～ じゃありません。",
                "Iie, ~ ja arimasen.",
                "No, no es ~."
              ],
              [
                "この ひと は だれ ですか？",
                "Kono hito wa dare desu ka?",
                "¿Quién es esta persona?"
              ],
              [
                "その かた は どなた ですか？",
                "Sono kata wa donata desu ka?",
                "¿Quién es esa persona? (formal)"
              ],
              [
                "この ひと は ～で、～です。",
                "Kono hito wa ~ de, ~ desu.",
                "Esta persona es ~ y ~."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-03",
    "number": 3,
    "title": "Saludos, partícula の y los números",
    "titleJp": "せいかつ・おいくつ",
    "date": "2026-03-21",
    "topics": "saludos y despedidas por momento del día, gracias y disculpas, partícula の (posesión), números 1–100, edad.",
    "sections": [
      {
        "id": "saludos",
        "title": "Saludos",
        "titleJp": "あいさつ",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español",
              "Horario"
            ],
            "rows": [
              [
                "おはよう ございます",
                "Ohayou gozaimasu",
                "¡Buenos días!",
                "6:00 – 11:30"
              ],
              [
                "こんにちは",
                "Konnichiwa",
                "¡Buenas tardes!",
                "12:00 – 19:00"
              ],
              [
                "こんばんは",
                "Konbanwa",
                "¡Buenas noches!",
                "19:00 en adelante"
              ],
              [
                "おやすみなさい",
                "Oyasuminasai",
                "¡Que descanses!",
                "Al irse a dormir"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "は en こんにちは y こんばんは se pronuncia **wa** (excepción histórica)."
          }
        ]
      },
      {
        "id": "despedidas",
        "title": "Despedidas",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "さようなら",
                "Sayounara",
                "Adiós (formal)"
              ],
              [
                "じゃあね！",
                "Jaa ne!",
                "¡Chau! (amigable)"
              ],
              [
                "またね！",
                "Mata ne!",
                "¡Nos vemos!"
              ],
              [
                "またあした",
                "Mata ashita",
                "¡Hasta mañana!"
              ],
              [
                "またこんど",
                "Mata kondo",
                "¡Hasta la próxima!"
              ]
            ]
          }
        ]
      },
      {
        "id": "gracias-y-disculpas",
        "title": "Gracias y disculpas",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "どうも ありがとう ございます",
                "Doumo arigatou gozaimasu",
                "Gracias (muy formal)"
              ],
              [
                "どういたしまして",
                "Douitashimashite",
                "De nada"
              ],
              [
                "いいえ、いいえ",
                "Iie, iie",
                "No, no… (restar importancia)"
              ],
              [
                "すみません",
                "Sumimasen",
                "Perdón / Disculpe (también para llamar la atención)"
              ],
              [
                "ごめんなさい",
                "Gomennasai",
                "Lo siento (disculpa sincera)"
              ],
              [
                "ごめんね",
                "Gomenne",
                "¡Mildis! (informal)"
              ]
            ]
          }
        ]
      },
      {
        "id": "particula-posesion-y-relacion",
        "title": "Partícula の — posesión y relación",
        "blocks": [
          {
            "kind": "text",
            "text": "Une dos sustantivos, como nuestro \"de\". **[A] の [B] = B de A**"
          },
          {
            "kind": "quote",
            "lines": [
              "でくちゃん は U.A.こうこう の がくせい です。 — Deku es alumno de la academia U.A.",
              "ジムさん は ダンダー・ミフリン の しゃいん です。 — Jim es empleado de Dunder Mifflin.",
              "とりやまさん は ドラゴンボール の まんがか です。 — Toriyama es el mangaka de Dragon Ball."
            ]
          }
        ]
      },
      {
        "id": "numeros",
        "title": "Números",
        "titleJp": "すうじ",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Nº",
              "Kanji",
              "Hiragana",
              "Romaji"
            ],
            "rows": [
              [
                "1",
                "一",
                "いち",
                "ichi"
              ],
              [
                "2",
                "二",
                "に",
                "ni"
              ],
              [
                "3",
                "三",
                "さん",
                "san"
              ],
              [
                "4",
                "四",
                "し／よん",
                "shi / yon"
              ],
              [
                "5",
                "五",
                "ご",
                "go"
              ],
              [
                "6",
                "六",
                "ろく",
                "roku"
              ],
              [
                "7",
                "七",
                "しち／なな",
                "shichi / nana"
              ],
              [
                "8",
                "八",
                "はち",
                "hachi"
              ],
              [
                "9",
                "九",
                "きゅう",
                "kyuu"
              ],
              [
                "10",
                "十",
                "じゅう",
                "juu"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "Números mayores: [decena] じゅう + [unidad]"
          },
          {
            "kind": "text",
            "text": "15 じゅうご · 18 じゅうはち · 27 にじゅうなな · 40 よんじゅう · 61 ろくじゅういち"
          }
        ]
      },
      {
        "id": "edad",
        "title": "Edad",
        "titleJp": "なんさい・おいくつ",
        "blocks": [
          {
            "kind": "list",
            "items": [
              "なんさい ですか？ (Nansai desu ka?) — informal",
              "おいくつ ですか？ (Oikutsu desu ka?) — formal"
            ]
          },
          {
            "kind": "text",
            "text": "Respuesta: **número + さい です。** → ３２さい です。 (San juu ni sai desu.)"
          },
          {
            "kind": "subheading",
            "text": "Excepciones fonéticas"
          },
          {
            "kind": "table",
            "headers": [
              "Caso",
              "Incorrecto",
              "Correcto",
              "Regla"
            ],
            "rows": [
              [
                "1さい",
                "いちさい",
                "いっさい issai",
                "1 antes de さい se lee いっ"
              ],
              [
                "8さい",
                "はちさい",
                "はっさい hassai",
                "8 antes de さい se lee はっ"
              ],
              [
                "10さい (y múltiplos)",
                "じゅうさい",
                "じゅっさい jussai",
                "El decimal antes de さい se lee じゅっ"
              ],
              [
                "20さい",
                "にじゅうさい",
                "はたち hatachi",
                "Excepción: los 20 años tienen palabra propia"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "はたち es un arcaísmo del japonés antiguo; es la mayoría de edad en Japón."
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "なんさい ですか？",
                "Nansai desu ka?",
                "¿Cuántos años tenés?"
              ],
              [
                "～さい です。",
                "~ sai desu.",
                "Tengo ~ años."
              ],
              [
                "[A] の [B] です。",
                "[A] no [B] desu.",
                "Es el/la [B] de [A]."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-04",
    "number": 4,
    "title": "Demostrativos これ・それ・あれ y vocabulario de objetos",
    "date": "2026-03-28",
    "topics": "pronombres demostrativos これ/それ/あれ, どこから来ましたか, vocabulario de objetos cotidianos (cap. 2).",
    "sections": [
      {
        "id": "pronombres-demostrativos",
        "title": "Pronombres demostrativos",
        "titleJp": "これ・それ・あれ",
        "blocks": [
          {
            "kind": "text",
            "text": "Son **pronombres**: funcionan solos, sin sustantivo detrás."
          },
          {
            "kind": "table",
            "headers": [
              "Pronombre",
              "Romaji",
              "Uso"
            ],
            "rows": [
              [
                "これ",
                "kore",
                "Esto (cerca del hablante)"
              ],
              [
                "それ",
                "sore",
                "Eso (cerca del oyente)"
              ],
              [
                "あれ",
                "are",
                "Aquello (lejos de ambos)"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "これ は りんご です。 — Esto es una manzana.",
              "それ は なん ですか？ — ¿Qué es eso?",
              "あれ は りんご です。 — Aquello es una manzana."
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "これ/それ/あれ son **pronombres** (van solos). この/その/あの son **adjetivos** (van con sustantivo)."
          },
          {
            "kind": "text",
            "text": "これ は りんご です (esto es una manzana) vs この りんご は あまい です (esta manzana está dulce)."
          }
        ]
      },
      {
        "id": "de-donde-venis",
        "title": "¿De dónde venís?",
        "titleJp": "どこ から きましたか？",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "どこ から きましたか？ (Doko kara kimashita ka?) — ¿De dónde venís?",
              "Palermo から きました。 — Vengo de Palermo."
            ]
          }
        ]
      },
      {
        "id": "vocabulario-de-objetos",
        "title": "Vocabulario de objetos",
        "titleJp": "だい２か の ごい",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "じしょ",
                "jisho",
                "Diccionario"
              ],
              [
                "かさ",
                "kasa",
                "Paraguas"
              ],
              [
                "ほん",
                "hon",
                "Libro"
              ],
              [
                "ボールペン",
                "boorupen",
                "Bolígrafo"
              ],
              [
                "ノート",
                "nooto",
                "Cuaderno"
              ],
              [
                "てちょう",
                "techou",
                "Agenda"
              ],
              [
                "めいし",
                "meishi",
                "Tarjeta de presentación"
              ],
              [
                "ざっし",
                "zasshi",
                "Revista"
              ],
              [
                "コンピューター",
                "konpyuutaa",
                "Computadora"
              ],
              [
                "かばん",
                "kaban",
                "Bolso/Mochila"
              ],
              [
                "かぎ",
                "kagi",
                "Llave"
              ],
              [
                "コーヒー",
                "koohii",
                "Café"
              ],
              [
                "カメラ",
                "kamera",
                "Cámara"
              ],
              [
                "テレビ",
                "terebi",
                "Televisión"
              ],
              [
                "つくえ",
                "tsukue",
                "Escritorio"
              ],
              [
                "しんぶん",
                "shinbun",
                "Diario/Periódico"
              ],
              [
                "シャープペンシル",
                "shaapupenshiru",
                "Portaminas"
              ],
              [
                "くるま",
                "kuruma",
                "Auto"
              ],
              [
                "とけい",
                "tokei",
                "Reloj"
              ],
              [
                "ラジオ",
                "rajio",
                "Radio"
              ],
              [
                "えんぴつ",
                "enpitsu",
                "Lápiz"
              ],
              [
                "いす",
                "isu",
                "Silla"
              ],
              [
                "CD",
                "shiidii",
                "CD"
              ],
              [
                "おみやげ",
                "omiyage",
                "Souvenir / Regalo típico"
              ]
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "これ は なん ですか？",
                "Kore wa nan desu ka?",
                "¿Qué es esto?"
              ],
              [
                "それ は なん ですか？",
                "Sore wa nan desu ka?",
                "¿Qué es eso?"
              ],
              [
                "あれ は なん ですか？",
                "Are wa nan desu ka?",
                "¿Qué es aquello?"
              ],
              [
                "それ は ～ ですか？",
                "Sore wa ~ desu ka?",
                "¿Eso es ~?"
              ],
              [
                "いいえ、～ じゃありません。",
                "Iie, ~ ja arimasen.",
                "No, no es ~."
              ],
              [
                "どこ から きましたか？",
                "Doko kara kimashita ka?",
                "¿De dónde venís?"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-05",
    "number": 5,
    "title": "¿De quién es?",
    "titleJp": "だれの, なんの y doble pregunta",
    "date": "2026-04-11",
    "topics": "doble pregunta, なんの (qué tipo), だれの (de quién), idiomas (～ご), そうです/ちがいます, pronombres vs adjetivos demostrativos.",
    "sections": [
      {
        "id": "doble-pregunta",
        "title": "Doble pregunta",
        "titleJp": "Sujeto は A ですか、B ですか？",
        "blocks": [
          {
            "kind": "text",
            "text": "Dos preguntas sobre el mismo sujeto se unen para no repetirlo:"
          },
          {
            "kind": "quote",
            "lines": [
              "それ は シャープペンシル ですか、えんぴつ ですか？ — ¿Eso es un portaminas o un lápiz?",
              "それ は 「ね」 ですか、「れ」 ですか？ — ¿Eso es \"ne\" o \"re\"?"
            ]
          }
        ]
      },
      {
        "id": "que-tipo-de",
        "title": "¿Qué tipo de...?",
        "titleJp": "なん の ～ ですか？",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "それ は なん の かぎ ですか？ — ¿Esa llave es de qué?",
              "それ は くるま の かぎ です。 — Es la llave del auto.",
              "それ は なん の ざっし ですか？ → Anime の ざっし です。 — Revista de anime."
            ]
          }
        ]
      },
      {
        "id": "de-quien-es",
        "title": "¿De quién es?",
        "titleJp": "だれ の ～ ですか？",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "それ は だれ の かぎ ですか？ → これ は やまださん の かぎ です。 — Es la llave de Yamada.",
              "それ は だれ の かさ ですか？ → これ は たむらさん の かさ です。 — Es el paraguas de Tamura."
            ]
          }
        ]
      },
      {
        "id": "idiomas",
        "title": "Idiomas",
        "titleJp": "くに + ご",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "País",
              "Idioma",
              "Romaji"
            ],
            "rows": [
              [
                "にほん Japón",
                "にほんご",
                "nihongo"
              ],
              [
                "ちゅうごく China",
                "ちゅうごくご",
                "chuugokugo"
              ],
              [
                "かんこく Corea",
                "かんこくご",
                "kankokugo"
              ],
              [
                "アメリカ/イギリス",
                "えいご",
                "eigo (inglés)"
              ],
              [
                "スペイン",
                "スペインご",
                "supeingo"
              ],
              [
                "イタリア",
                "イタリアご",
                "itariago"
              ],
              [
                "フランス",
                "フランスご",
                "furansugo"
              ],
              [
                "ドイツ",
                "ドイツご",
                "doitsugo"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "ご significa \"lenguaje/habla\". Sufijo sobre el nombre del país; funciona en la mayoría de los casos."
          }
        ]
      },
      {
        "id": "confirmar-y-negar",
        "title": "Confirmar y negar",
        "titleJp": "そうです y ちがいます",
        "blocks": [
          {
            "kind": "list",
            "items": [
              "はい、そう です。 (Hai, sou desu.) — Sí, así es.",
              "いいえ、ちがいます。 (Iie, chigaimasu.) — No, no es así."
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "それ は くるま の かぎ ですか？ → いいえ、ちがいます。うち の かぎ です。 — No, es la llave de mi casa."
            ]
          }
        ]
      },
      {
        "id": "pronombres-vs-adjetivos-demostrativos",
        "title": "Pronombres vs. adjetivos demostrativos",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Tipo",
              "Japonés",
              "Uso",
              "Ejemplo"
            ],
            "rows": [
              [
                "Pronombre",
                "これ / それ / あれ",
                "Van solos",
                "これ は ほん です"
              ],
              [
                "Adjetivo",
                "この / その / あの",
                "+ sustantivo obligatorio",
                "この ほん は わたし の です"
              ]
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "それ は A ですか、B ですか？",
                "Sore wa A desu ka, B desu ka?",
                "¿Eso es A o B?"
              ],
              [
                "なん の ～ ですか？",
                "Nan no ~ desu ka?",
                "¿Qué tipo de ~?"
              ],
              [
                "だれ の ～ ですか？",
                "Dare no ~ desu ka?",
                "¿De quién es el/la ~?"
              ],
              [
                "はい、そう です。",
                "Hai, sou desu.",
                "Sí, así es."
              ],
              [
                "いいえ、ちがいます。",
                "Iie, chigaimasu.",
                "No, no es así."
              ],
              [
                "それ は にほんご の ほん ですか？",
                "Sore wa nihongo no hon desu ka?",
                "¿Ese libro es en japonés?"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-06",
    "number": 6,
    "title": "Repaso y práctica",
    "titleJp": "これは～のです y patrones de posesión",
    "date": "2026-04-18",
    "topics": "",
    "sections": [
      {
        "id": "general",
        "title": "General",
        "blocks": [
          {
            "kind": "text",
            "text": "Clase de repaso: vocabulario del capítulo 2 y patrones de posesión con の."
          }
        ]
      },
      {
        "id": "patrones-de-posesion",
        "title": "Patrones de posesión",
        "blocks": [
          {
            "kind": "subheading",
            "text": "¿Esto es de ~? — これは～のですか？"
          },
          {
            "kind": "quote",
            "lines": [
              "これは Wanさん の ですか？ — ¿Esto es de Wan?",
              "いいえ、Wanさん の じゃ ありません。 — No, no es de Wan."
            ]
          },
          {
            "kind": "subheading",
            "text": "¿De quién es este objeto? — この～はだれのですか？"
          },
          {
            "kind": "quote",
            "lines": [
              "この かばん は だれ の ですか？ → やまださん の です。 — Es de Yamada.",
              "この カメラ は だれ の ですか？ → Santosuさん の です。",
              "この てちょう は だれ の ですか？ → Miraaさん の です。"
            ]
          }
        ]
      },
      {
        "id": "como-pronombre",
        "title": "「の」 como pronombre",
        "blocks": [
          {
            "kind": "text",
            "text": "Cuando el objeto ya es conocido, se omite el sustantivo y の queda como pronombre:"
          },
          {
            "kind": "quote",
            "lines": [
              "これ は ハリーポッター の ほん です。 — Esto es el libro de Harry Potter.",
              "この ほん は わたし の です。 — Este libro es mío (ほん se sobreentiende)."
            ]
          },
          {
            "kind": "text",
            "text": "**わたし の です** = es mío."
          }
        ]
      },
      {
        "id": "patrones-de-conversacion",
        "title": "Patrones de conversación",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Pregunta",
              "Positiva",
              "Negativa"
            ],
            "rows": [
              [
                "これは ～さん の ですか？",
                "はい、～さん の です。",
                "いいえ、～さん の じゃ ありません。"
              ],
              [
                "この ～ は だれ の ですか？",
                "～さん の です。",
                "いいえ、～さん の じゃありません。～さん の です。"
              ]
            ]
          }
        ]
      },
      {
        "id": "vocabulario-capitulo-2-repaso",
        "title": "Vocabulario capítulo 2 (repaso)",
        "blocks": [
          {
            "kind": "text",
            "text": "かさ paraguas · じしょ diccionario · ほん libro · ボールペン bolígrafo · ノート cuaderno · てちょう agenda · めいし tarjeta de presentación · ざっし revista · コンピューター computadora · かばん bolso · かぎ llave · コーヒー café · カメラ cámara · テレビ televisión · つくえ escritorio · しんぶん diario · シャープペンシル portaminas · くるま auto · とけい reloj · ラジオ radio · えんぴつ lápiz · いす silla · CD · おみやげ souvenir"
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "これは ～さん の ですか？",
                "Kore wa ~-san no desu ka?",
                "¿Esto es de ~?"
              ],
              [
                "はい、～さん の です。",
                "Hai, ~-san no desu.",
                "Sí, es de ~."
              ],
              [
                "いいえ、～さん の じゃありません。",
                "Iie, ~-san no ja arimasen.",
                "No, no es de ~."
              ],
              [
                "この ～ は だれ の ですか？",
                "Kono ~ wa dare no desu ka?",
                "¿De quién es este/a ~?"
              ],
              [
                "～さん の です。",
                "~-san no desu.",
                "Es de ~."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-08",
    "number": 8,
    "title": "¿Dónde está?",
    "titleJp": "ここ・そこ・あそこ y números grandes",
    "date": "2026-05-02",
    "topics": "adverbios de lugar, versiones formales こちら/そちら/あちら/どちら, vocabulario de lugares, escuelas, números grandes (100/1000/10000).",
    "sections": [
      {
        "id": "adverbios-de-lugar",
        "title": "Adverbios de lugar",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Uso"
            ],
            "rows": [
              [
                "ここ",
                "koko",
                "Aquí (cerca del hablante)"
              ],
              [
                "そこ",
                "soko",
                "Ahí (cerca del oyente)"
              ],
              [
                "あそこ",
                "asoko",
                "Allá (lejos de ambos)"
              ],
              [
                "どこ",
                "doko",
                "¿Dónde?"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "Versiones formales"
          },
          {
            "kind": "text",
            "text": "ここ→こちら (kochira) · そこ→そちら (sochira) · あそこ→あちら (achira) · どこ→どちら (dochira)"
          }
        ]
      },
      {
        "id": "donde-esta",
        "title": "¿Dónde está?",
        "titleJp": "～は どこ ですか？",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "ここ は じむしょ です。 — Aquí está la oficina.",
              "そこ は かいだん です。 — Ahí está la escalera.",
              "あそこ は トイレ です。 — Allá está el baño.",
              "ロビー は どこ ですか？ → ロビー は ここ です。",
              "いぬ は どこ ですか？ → いぬ は へや です。 — El perro está en la habitación."
            ]
          }
        ]
      },
      {
        "id": "vocabulario-de-lugares",
        "title": "Vocabulario de lugares",
        "blocks": [
          {
            "kind": "subheading",
            "text": "Dentro de un edificio"
          },
          {
            "kind": "text",
            "text": "じむしょ oficina · ロビー lobby · かいぎしつ sala de reuniones · エレベーター ascensor · うけつけ recepción · きょうしつ aula · しょくどう comedor · としょかん biblioteca · おくじょう terraza · トイレ baño · かいだん escalera · エスカレーター escalera mecánica · ちゅうしゃじょう estacionamiento · レストラン restaurante · きっさてん café/bar · みせ tienda · えいがかん cine"
          },
          {
            "kind": "subheading",
            "text": "En la ciudad"
          },
          {
            "kind": "text",
            "text": "デパート tienda por departamentos · びじゅつかん museo de arte · みなと puerto · かいしゃ empresa · ゆうびんきょく correo · びょういん hospital · こうえん parque/plaza · ぎんこう banco · くうこう aeropuerto · えき estación · アパート departamento · スーパー supermercado · ビル edificio · うち casa"
          },
          {
            "kind": "subheading",
            "text": "Escuelas"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ようちえん",
                "youchien",
                "Jardín de infantes"
              ],
              [
                "しょうがっこう",
                "shougakkou",
                "Primaria"
              ],
              [
                "ちゅうがっこう",
                "chuugakkou",
                "Secundaria baja (13–15)"
              ],
              [
                "こうこう",
                "koukou",
                "Secundaria alta / bachillerato (16–18)"
              ],
              [
                "だいがく",
                "daigaku",
                "Universidad"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "Sistema japonés: 6 años primaria, 3 secundaria baja, 3 secundaria alta; universidad 4 años."
          }
        ]
      },
      {
        "id": "numeros-grandes",
        "title": "Números grandes",
        "titleJp": "ひゃく・せん・まん",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Valor",
              "Japonés",
              "Romaji"
            ],
            "rows": [
              [
                "100",
                "ひゃく",
                "hyaku"
              ],
              [
                "1.000",
                "せん",
                "sen"
              ],
              [
                "10.000",
                "まん",
                "man"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "Ejemplos: 134 ひゃくさんじゅうよん · 561 ごひゃくろくじゅういち · 1.543 せんごひゃくよんじゅうさん · 17.543 いちまんななせんごひゃくよんじゅうさん"
          },
          {
            "kind": "subheading",
            "text": "Excepciones de pronunciación"
          },
          {
            "kind": "text",
            "text": "300 さんびゃく sanbyaku · 600 ろっぴゃく roppyaku · 800 はっぴゃく happyaku · 3.000 さんぜん sanzen · 8.000 はっせん hassen"
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ここ は ～ です。",
                "Koko wa ~ desu.",
                "Aquí está ~."
              ],
              [
                "～ は どこ ですか？",
                "~ wa doko desu ka?",
                "¿Dónde está ~?"
              ],
              [
                "～ は ここ/そこ/あそこ です。",
                "~ wa koko/soko/asoko desu.",
                "~ está aquí/ahí/allá."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-09",
    "number": 9,
    "title": "Precios, pisos y ¿de dónde es?",
    "titleJp": "いくら・なんがい・どこの",
    "date": "2026-05-09",
    "topics": "precios (いくら), pisos (なんがい), どちら para pertenencia, どこの para procedencia de objetos, diálogo de compras.",
    "sections": [
      {
        "id": "cuanto-cuesta",
        "title": "¿Cuánto cuesta?",
        "titleJp": "いくら",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "～ は いくら ですか？ — ¿Cuánto cuesta ~?",
              "～ は いくらぐらい ですか？ — ¿Cuánto cuesta ~ aproximadamente?"
            ]
          },
          {
            "kind": "text",
            "text": "Monedas: 円/えん en (yen) · ドル doru (dólar) · ペソ peso"
          },
          {
            "kind": "text",
            "text": "Diálogo:"
          },
          {
            "kind": "quote",
            "lines": [
              "すみません。その ざっし は いくら ですか？ — ¿Cuánto cuesta esa revista?",
              "４８５０えん です。 (Yonsen happyaku gojuu en desu.) — 4.850 yenes."
            ]
          }
        ]
      },
      {
        "id": "en-que-piso-esta",
        "title": "¿En qué piso está?",
        "titleJp": "何階 (なんがい)",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "～ は なんがい ですか？ — ¿En qué piso está ~?",
              "ほんや は ７かい です。 — La librería está en el piso 7."
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Piso",
              "Japonés"
            ],
            "rows": [
              [
                "1er piso",
                "いっかい ikkai"
              ],
              [
                "2do piso",
                "にかい nikai"
              ],
              [
                "3er piso",
                "さんがい sangai"
              ],
              [
                "Sótano 1",
                "ちかいっかい"
              ],
              [
                "Sótano 2",
                "ちかにかい"
              ]
            ]
          }
        ]
      },
      {
        "id": "tiendas-en-un-departamento",
        "title": "Tiendas (en un departamento)",
        "blocks": [
          {
            "kind": "text",
            "text": "ほんや librería · くすりや farmacia · はなや floristería · えいがかん cine · ようふくや tienda de ropa · ぱんや panadería · ちゅうしゃじょう estacionamiento · くつや zapatería · ワインうりば sección de vinos"
          }
        ]
      },
      {
        "id": "de-donde-es-personas",
        "title": "¿De dónde es? (personas)",
        "titleJp": "どちら",
        "blocks": [
          {
            "kind": "text",
            "text": "Para lugar de pertenencia (país, empresa, universidad) se usa **どちら**, no どこ."
          },
          {
            "kind": "table",
            "headers": [
              "Pregunta",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "おくに は どちら ですか？",
                "Okuni wa dochira desu ka?",
                "¿De qué país es usted?"
              ],
              [
                "おかいしゃ は どちら ですか？",
                "Okaisha wa dochira desu ka?",
                "¿En qué empresa trabaja?"
              ],
              [
                "おだいがく は どちら ですか？",
                "Odaigaku wa dochira desu ka?",
                "¿En qué universidad estudia?"
              ],
              [
                "うち は どちら ですか？",
                "Uchi wa dochira desu ka?",
                "¿De qué parte es?"
              ]
            ]
          }
        ]
      },
      {
        "id": "de-donde-es-este-objeto",
        "title": "¿De dónde es este objeto?",
        "titleJp": "どこ の ～ ですか？",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "それ は どこ の かばん ですか？ → これ は イタリア の かばん です。 — Cartera italiana.",
              "それ は どこ の ワイン ですか？ → フランス の ワイン です。 — Vino francés."
            ]
          },
          {
            "kind": "text",
            "text": "Sin repetir el sustantivo: それ は どこ の ですか？ → ブラジル の です。"
          }
        ]
      },
      {
        "id": "dialogo-de-compra",
        "title": "Diálogo de compra",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "いらっしゃいませ！ — ¡Bienvenido!",
              "すみません。その ゲーム の ほん を みせて ください。 — ¿Me muestra ese libro de juegos?",
              "これですか？どうぞ。 — ¿Este? Aquí tiene.",
              "いくらですか？ → ５６０円です。 — 560 yenes.",
              "じゃ、それ を ください。 — Entonces, déme ese.",
              "かしこまりました。どうぞ。 — Entendido. Aquí tiene."
            ]
          },
          {
            "kind": "subheading",
            "text": "Frases útiles para compras"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "～ を みせて ください",
                "~ wo misete kudasai",
                "Muéstreme ~"
              ],
              [
                "～ を ください",
                "~ wo kudasai",
                "Déme ~"
              ],
              [
                "いらっしゃいませ！",
                "Irasshaimase!",
                "¡Bienvenido! (tiendas)"
              ],
              [
                "ようこそ [lugar] へ",
                "Youkoso [lugar] e",
                "Bienvenido a [lugar] (no tiendas)"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "いらっしゃいませ en tiendas/locales; ようこそ para ciudades, eventos, escuelas."
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-10",
    "number": 10,
    "title": "Vocabulario de tiempo",
    "date": "2026",
    "topics": "días relativos al presente, semanas/meses/años, partes del día, expresiones de frecuencia まい～.",
    "sections": [
      {
        "id": "dias-relativos-al-presente-sin-particula",
        "title": "Días relativos al presente (sin partícula に)",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Kanji",
              "Hiragana",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "今日",
                "きょう",
                "kyou",
                "hoy"
              ],
              [
                "昨日",
                "きのう",
                "kinou",
                "ayer"
              ],
              [
                "明日",
                "あした",
                "ashita",
                "mañana"
              ],
              [
                "明後日",
                "あさって",
                "asatte",
                "pasado mañana"
              ],
              [
                "一昨日",
                "おととい",
                "ototoi",
                "anteayer"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "きょう は なんようび ですか？ — ¿Qué día es hoy?"
            ]
          }
        ]
      },
      {
        "id": "semanas-meses-y-anos",
        "title": "Semanas, meses y años",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Kanji",
              "Hiragana",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "今週",
                "こんしゅう",
                "konshuu",
                "esta semana"
              ],
              [
                "先週",
                "せんしゅう",
                "senshuu",
                "la semana pasada"
              ],
              [
                "来週",
                "らいしゅう",
                "raishuu",
                "la semana que viene"
              ],
              [
                "今月",
                "こんげつ",
                "kongetsu",
                "este mes"
              ],
              [
                "先月",
                "せんげつ",
                "sengetsu",
                "el mes pasado"
              ],
              [
                "来月",
                "らいげつ",
                "raigetsu",
                "el mes que viene"
              ],
              [
                "今年",
                "ことし",
                "kotoshi",
                "este año"
              ],
              [
                "去年",
                "きょねん",
                "kyonen",
                "el año pasado"
              ],
              [
                "来年",
                "らいねん",
                "rainen",
                "el año que viene"
              ]
            ]
          }
        ]
      },
      {
        "id": "partes-del-dia",
        "title": "Partes del día",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Kanji",
              "Hiragana",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "朝",
                "あさ",
                "asa",
                "mañana"
              ],
              [
                "昼",
                "ひる",
                "hiru",
                "mediodía"
              ],
              [
                "晩",
                "ばん",
                "ban",
                "tarde/noche"
              ],
              [
                "夜",
                "よる",
                "yoru",
                "noche"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "Con 今:"
          },
          {
            "kind": "table",
            "headers": [
              "今朝",
              "けさ",
              "kesa",
              "esta mañana"
            ],
            "rows": [
              [
                "今晩",
                "こんばん",
                "konban",
                "esta noche (tarde)"
              ],
              [
                "今夜",
                "こんや",
                "konya",
                "esta noche"
              ]
            ]
          }
        ]
      },
      {
        "id": "frecuencia",
        "title": "Frecuencia",
        "titleJp": "まい～ (毎 = \"cada\")",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Kanji",
              "Hiragana",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "毎日",
                "まいにち",
                "mainichi",
                "todos los días"
              ],
              [
                "毎朝",
                "まいあさ",
                "maiasa",
                "todas las mañanas"
              ],
              [
                "毎晩",
                "まいばん",
                "maiban",
                "todas las noches"
              ],
              [
                "毎夜",
                "まいよ",
                "maiyo",
                "todas las noches"
              ],
              [
                "毎月",
                "まいげつ/まいつき",
                "maigetsu/maitsuki",
                "todos los meses"
              ],
              [
                "毎年",
                "まいねん",
                "mainen",
                "todos los años"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "Ninguna de estas expresiones lleva に."
          },
          {
            "kind": "quote",
            "lines": [
              "まいにち べんきょう します。 — Estudio todos los días.",
              "けさ おきました。 — Me levanté esta mañana."
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "きょう は なんようび ですか？",
                "Kyou wa nanyoubi desu ka?",
                "¿Qué día es hoy?"
              ],
              [
                "きのう は なんようび でしたか？",
                "Kinou wa nanyoubi deshita ka?",
                "¿Qué día fue ayer?"
              ],
              [
                "こんしゅう べんきょう します。",
                "Konshuu benkyoushimasu.",
                "Estudio esta semana."
              ],
              [
                "まいにち はたらきます。",
                "Mainichi hatarakimasu.",
                "Trabajo todos los días."
              ],
              [
                "けさ おきませんでした。",
                "Kesa okimasendeshita.",
                "Esta mañana no me levanté."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-11",
    "number": 11,
    "title": "¿Qué hora es?",
    "titleJp": "いま なんじ ですか",
    "date": "2026-05-23",
    "topics": "horas (〜じ), minutos (〜ふん/ぷん), y media (〜はん), AM/PM (ごぜん/ごご), rangos con から/まで.",
    "sections": [
      {
        "id": "horas",
        "title": "Horas",
        "titleJp": "〜時 (〜ji)",
        "blocks": [
          {
            "kind": "text",
            "text": "Número + じ(時)."
          },
          {
            "kind": "table",
            "headers": [
              "Hora",
              "Hiragana",
              "¡OJO!"
            ],
            "rows": [
              [
                "1:00",
                "いちじ",
                ""
              ],
              [
                "2:00",
                "にじ",
                ""
              ],
              [
                "3:00",
                "さんじ",
                ""
              ],
              [
                "4:00",
                "**よじ**",
                "✗ よんじ"
              ],
              [
                "5:00",
                "ごじ",
                ""
              ],
              [
                "6:00",
                "ろくじ",
                ""
              ],
              [
                "7:00",
                "**しちじ**",
                "✗ ななじ"
              ],
              [
                "8:00",
                "はちじ",
                ""
              ],
              [
                "9:00",
                "**くじ**",
                "✗ きゅうじ"
              ],
              [
                "10:00",
                "じゅうじ",
                ""
              ],
              [
                "11:00",
                "じゅういちじ",
                ""
              ],
              [
                "12:00",
                "じゅうにじ",
                ""
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "Tres excepciones: よじ (4), しちじ (7), くじ (9)."
          }
        ]
      },
      {
        "id": "minutos",
        "title": "Minutos",
        "titleJp": "〜分 (〜fun/〜pun)",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Minutos",
              "Lectura"
            ],
            "rows": [
              [
                "1, 2, 3, 4",
                "いっぷん、にふん、さんぷん、よんぷん"
              ],
              [
                "5, 6",
                "ごふん、ろっぷん"
              ],
              [
                "7, 8",
                "ななふん、はっぷん"
              ],
              [
                "9, 10",
                "きゅうふん、じゅっぷん"
              ],
              [
                "13, 28, 36",
                "じゅうさんぷん、にじゅうはっぷん、さんじゅうろっぷん"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "３時５分 さんじごふん · ６時１５分 ろくじじゅうごふん · ２時２０分 にじにじゅっぷん · ４時４１分 よじよんじゅういっぷん"
            ]
          }
        ]
      },
      {
        "id": "y-media",
        "title": "Y media",
        "titleJp": "〜半 (〜han)",
        "blocks": [
          {
            "kind": "text",
            "text": "Hora + はん."
          },
          {
            "kind": "quote",
            "lines": [
              "９時半 くじはん — 9 y media · ２時半 にじはん — 2 y media",
              "いま １１時半 です。 — Son las 11 y media."
            ]
          }
        ]
      },
      {
        "id": "am-y-pm",
        "title": "AM y PM",
        "titleJp": "ごぜん / ごご",
        "blocks": [
          {
            "kind": "text",
            "text": "Van antes de la hora. ごぜん(午前)=AM · ごご(午後)=PM"
          },
          {
            "kind": "quote",
            "lines": [
              "ごぜん いちじ じゅうごふん — 1:15 AM · ごご はちじ — 8:00 PM",
              "いま ごぜん １時５０分 です。 — Es la 1:50 AM."
            ]
          }
        ]
      },
      {
        "id": "desde-hasta",
        "title": "Desde / Hasta",
        "titleJp": "から / まで",
        "blocks": [
          {
            "kind": "text",
            "text": "から = desde · まで = hasta. Se usan con horas y días."
          },
          {
            "kind": "quote",
            "lines": [
              "パンやは ごぜん１１じから ごご９じまで です。 — La panadería abre de 11 AM a 9 PM.",
              "ぎんこう は なんじから なんじまで ですか？ → ９じから ３じまで です。"
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "いま なんじ ですか？",
                "Ima nanji desu ka?",
                "¿Qué hora es ahora?"
              ],
              [
                "いま ３時半 です。",
                "Ima sanji han desu.",
                "Son las 3 y media."
              ],
              [
                "ごぜん ９じ です。",
                "Gozen 9ji desu.",
                "Son las 9 AM."
              ],
              [
                "ごご ６じ です。",
                "Gogo 6ji desu.",
                "Son las 6 PM."
              ],
              [
                "なんじから なんじまで ですか？",
                "Nanji kara nanji made desu ka?",
                "¿De qué hora a qué hora?"
              ],
              [
                "９じから ５じまで です。",
                "9ji kara 5ji made desu.",
                "De las 9 a las 5."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-12",
    "number": 12,
    "title": "Días de la semana, meses y el pasado de です",
    "date": "2026-05-30",
    "topics": "días de la semana (kanji y origen), pasado de です (でした/じゃありませんでした), meses (〜がつ), años (〜ねん).",
    "sections": [
      {
        "id": "dias-de-la-semana",
        "title": "Días de la semana",
        "titleJp": "漢字とようび",
        "blocks": [
          {
            "kind": "text",
            "text": "Basados en los cinco elementos clásicos + Sol y Luna."
          },
          {
            "kind": "table",
            "headers": [
              "Día",
              "Kanji",
              "Hiragana",
              "Elemento"
            ],
            "rows": [
              [
                "Lunes",
                "月曜日",
                "げつようび",
                "月 Luna"
              ],
              [
                "Martes",
                "火曜日",
                "かようび",
                "火 Fuego"
              ],
              [
                "Miércoles",
                "水曜日",
                "すいようび",
                "水 Agua"
              ],
              [
                "Jueves",
                "木曜日",
                "もくようび",
                "木 Árbol"
              ],
              [
                "Viernes",
                "金曜日",
                "きんようび",
                "金 Oro"
              ],
              [
                "Sábado",
                "土曜日",
                "どようび",
                "土 Suelo"
              ],
              [
                "Domingo",
                "日曜日",
                "にちようび",
                "日 Sol/Día"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "きょう は なんようび ですか？ → きょう は すいようび です。 — Hoy es miércoles."
            ]
          }
        ]
      },
      {
        "id": "pasado-de",
        "title": "Pasado de です",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Tiempo",
              "Positivo",
              "Negativo"
            ],
            "rows": [
              [
                "Presente",
                "です",
                "じゃありません"
              ],
              [
                "Pasado",
                "**でした**",
                "**じゃありませんでした**"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "きのう は きんようび でした。 — Ayer fue viernes.",
              "おととい は げつようび じゃありませんでした。 — Anteayer no fue lunes.",
              "きのう は なんようび でしたか？ — ¿Qué día fue ayer?"
            ]
          }
        ]
      },
      {
        "id": "meses",
        "title": "Meses",
        "titleJp": "〜月 (〜がつ)",
        "blocks": [
          {
            "kind": "text",
            "text": "Número + がつ. Sin nombres especiales. 1月 いちがつ · 2月 にがつ · 3月 さんがつ · 4月 **しがつ** · 5月 ごがつ · 6月 ろくがつ · 7月 なながつ · 8月 はちがつ · 9月 **くがつ** · 10月 じゅうがつ · 11月 じゅういちがつ · 12月 じゅうにがつ"
          },
          {
            "kind": "quote",
            "lines": [
              "こんげつ は ８がつ です。 — Este mes es agosto.",
              "らいげつ は なんがつ ですか？ — ¿Qué mes es el que viene?",
              "なつ は なんがつから なんがつまで ですか？ → １２がつから ３がつまで です。"
            ]
          }
        ]
      },
      {
        "id": "anos",
        "title": "Años",
        "titleJp": "〜年 (〜ねん)",
        "blocks": [
          {
            "kind": "text",
            "text": "Número + ねん."
          },
          {
            "kind": "quote",
            "lines": [
              "ことし は ２０２６ねん です。 — Este año es 2026.",
              "きょねん は ２０２５ねん でした。 — El año pasado fue 2025.",
              "とうきょうオリンピック は ２０２０ねん でした。 — Las Olimpíadas de Tokio fueron en 2020."
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "きょう は なんようび ですか？",
                "Kyou wa nanyoubi desu ka?",
                "¿Qué día es hoy?"
              ],
              [
                "きのう は なんようび でしたか？",
                "Kinou wa nanyoubi deshita ka?",
                "¿Qué día fue ayer?"
              ],
              [
                "こんげつ は なんがつ ですか？",
                "Kongetsu wa nangatsu desu ka?",
                "¿Qué mes es este mes?"
              ],
              [
                "ことし は なんねん ですか？",
                "Kotoshi wa nannen desu ka?",
                "¿Qué año es este año?"
              ],
              [
                "やすみ は なんようびから なんようびまで ですか？",
                "Yasumi wa nanyoubi kara nanyoubi made desu ka?",
                "¿El descanso es de qué día a qué día?"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-13",
    "number": 13,
    "title": "Verbos del だい4か, partícula に y から～まで",
    "date": "2026-06-06",
    "topics": "conjugación formal de verbos nuevos, partícula に (horas exactas), から～まで, はじまります, vocabulario de tiempo, número de teléfono, diálogo del libro.",
    "sections": [
      {
        "id": "conjugacion-formal-estilo",
        "title": "Conjugación formal (estilo ます)",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Tiempo",
              "Forma",
              "Terminación"
            ],
            "rows": [
              [
                "Presente positivo",
                "します",
                "～ます"
              ],
              [
                "Presente negativo",
                "しません",
                "～ません"
              ],
              [
                "Pasado positivo",
                "しました",
                "～ました"
              ],
              [
                "Pasado negativo",
                "しませんでした",
                "～ませんでした"
              ]
            ]
          }
        ]
      },
      {
        "id": "verbos-del-4",
        "title": "Verbos del だい4か",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Verbo",
              "Significado",
              "Ejemplo"
            ],
            "rows": [
              [
                "おきる (okiru)",
                "levantarse",
                "８じ に おきます。— Me levanto a las 8."
              ],
              [
                "べんきょうする",
                "estudiar",
                "まいにち べんきょう します。— Estudio todos los días."
              ],
              [
                "はたらく",
                "trabajar",
                "げつようび から きんようび まで はたらきます。— Trabajo de lunes a viernes."
              ],
              [
                "ねる",
                "dormir",
                "１１じ に ねます。— Me duermo a las 11."
              ],
              [
                "おわる",
                "terminar",
                "しごと は ６じはん に おわります。— El trabajo termina a las 6:30."
              ],
              [
                "やすむ",
                "descansar",
                "にちようび に やすみます。— Descanso el domingo."
              ]
            ]
          },
          {
            "kind": "text",
            "text": "(Cada uno conjuga: ～ます / ～ません / ～ました / ～ませんでした)"
          }
        ]
      },
      {
        "id": "particula-horas-exactas",
        "title": "Partícula に — horas exactas",
        "blocks": [
          {
            "kind": "text",
            "text": "**[hora] に + [verbo]**"
          },
          {
            "kind": "quote",
            "lines": [
              "８じ に おきます。 · ６じはん に おわります。",
              "なんじ に おきますか？ — ¿A qué hora te levantás?"
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "に NO se usa con まいにち, きのう, きょう, あした."
          }
        ]
      },
      {
        "id": "rango",
        "title": "から / まで — rango",
        "blocks": [
          {
            "kind": "text",
            "text": "**[inicio] から [fin] まで [verbo]**"
          },
          {
            "kind": "quote",
            "lines": [
              "げつようび から きんようび まで はたらきます。 — De lunes a viernes.",
              "９じ から ６じ まで はたらきます。 — De 9 a 6.",
              "かいぎ は ４じ から はじまります。 — La reunión empieza a las 4."
            ]
          }
        ]
      },
      {
        "id": "verbo-nuevo",
        "title": "Verbo nuevo: はじまります",
        "blocks": [
          {
            "kind": "text",
            "text": "\"Empieza/comienza\" (algo empieza solo, sin agente): clases, reuniones, películas."
          },
          {
            "kind": "quote",
            "lines": [
              "くらす は ６じ に おわります。 — La clase termina a las 6."
            ]
          }
        ]
      },
      {
        "id": "vocabulario-de-tiempo-sin",
        "title": "Vocabulario de tiempo (sin に)",
        "blocks": [
          {
            "kind": "text",
            "text": "まいにち todos los días · まいあさ todas las mañanas · まいばん todas las noches · けさ esta mañana · きのう ayer · きょう hoy · あした mañana · おととい anteayer · あさって pasado mañana · ごぜん AM"
          },
          {
            "kind": "quote",
            "lines": [
              "まいにち ９じ から ６じ まで はたらきます。",
              "きのう の ばん べんきょう しました。 — Estudié anoche."
            ]
          }
        ]
      },
      {
        "id": "numero-de-telefono",
        "title": "Número de teléfono",
        "titleJp": "でんわばんごう",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "[lugar] の でんわばんごう は なんばん ですか？ — ¿Cuál es el teléfono de [lugar]?"
            ]
          },
          {
            "kind": "text",
            "text": "Se lee dígito por dígito, separado con の:"
          },
          {
            "kind": "quote",
            "lines": [
              "０９０ の １２３４ の ５６７８ です。"
            ]
          },
          {
            "kind": "text",
            "text": "Celular = けいたいでんわ / けいたい."
          }
        ]
      },
      {
        "id": "dialogo",
        "title": "Diálogo: そちらは何時までですか",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "ミラー: すみません、「あすか」の でんわばんごう は なんばん ですか。",
              "佐藤: 「あすか」ですか。５２７５ の ２７２５ です。",
              "店の人: はい、「あすか」です。",
              "ミラー: すみません。そちらは なんじ まで ですか。",
              "店の人: １０じ まで です。",
              "ミラー: やすみ は なんようび ですか。",
              "店の人: にちようび です。"
            ]
          },
          {
            "kind": "text",
            "text": "そちら = forma educada de \"ustedes / ese lugar\" (llamadas formales)."
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "なんじ に おきますか？",
                "Nanji ni okimasu ka?",
                "¿A qué hora te levantás?"
              ],
              [
                "なんじ から なんじ まで はたらきますか？",
                "Nanji kara nanji made hatarakimasu ka?",
                "¿De qué hora a qué hora trabajás?"
              ],
              [
                "げつようび から きんようび まで です。",
                "Getsuyoubi kara kin'youbi made desu.",
                "Es de lunes a viernes."
              ],
              [
                "やすみ は なんようび ですか？",
                "Yasumi wa nanyoubi desu ka?",
                "¿Qué día es el día libre?"
              ],
              [
                "そちらは なんじ まで ですか？",
                "Sochira wa nanji made desu ka?",
                "¿Hasta qué hora están abiertos?"
              ],
              [
                "でんわばんごう は なんばん ですか？",
                "Denwa bangou wa nanban desu ka?",
                "¿Cuál es el número de teléfono?"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-14",
    "number": 14,
    "title": "Grupos de verbos",
    "titleJp": "どうし の グループ",
    "date": "2026-06-13",
    "topics": "los 3 grupos de verbos, formas じしょ形 / ます形 / ました形, conjugación positiva y negativa, verbos compuestos con する.",
    "sections": [
      {
        "id": "informacion-general",
        "title": "Información general",
        "blocks": [
          {
            "kind": "list",
            "items": [
              "\"Verbo\" = どうし (動詞). Siempre va al final de la oración.",
              "No cambian por persona, número ni género.",
              "Solo dos tiempos: pasado y no-pasado.",
              "Se dividen en 3 grupos según su conjugación."
            ]
          }
        ]
      },
      {
        "id": "las-tres-formas",
        "title": "Las tres formas",
        "titleJp": "三つの形",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Nombre",
              "Descripción",
              "Equivalente"
            ],
            "rows": [
              [
                "じしょ形",
                "Forma diccionario / infinitivo",
                "hablar, correr"
              ],
              [
                "ます形",
                "No-pasado formal",
                "hablo, corro"
              ],
              [
                "ました形",
                "Pasado formal",
                "hablé, corrí"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "Todo verbo en じしょ形 termina en vocal U: る、く、ぐ、す、む、ぬ、ぶ、つ、う."
          }
        ]
      },
      {
        "id": "grupo-2",
        "title": "Grupo 2",
        "titleJp": "にグループ — terminan en ERU/IRU",
        "blocks": [
          {
            "kind": "text",
            "text": "Regla: se elimina る y se agrega ます/ません/ました/ませんでした."
          },
          {
            "kind": "table",
            "headers": [
              "Infinitivo",
              "Significado",
              "ます(+)",
              "ます(−)",
              "ました(+)",
              "ました(−)"
            ],
            "rows": [
              [
                "おきる",
                "levantarse",
                "おきます",
                "おきません",
                "おきました",
                "おきませんでした"
              ],
              [
                "ねる",
                "dormir",
                "ねます",
                "ねません",
                "ねました",
                "ねませんでした"
              ],
              [
                "たべる",
                "comer",
                "たべます",
                "たべません",
                "たべました",
                "たべませんでした"
              ],
              [
                "みる",
                "mirar",
                "みます",
                "みません",
                "みました",
                "みませんでした"
              ],
              [
                "きる",
                "vestir",
                "きます",
                "きません",
                "きました",
                "きませんでした"
              ],
              [
                "あける",
                "abrir",
                "あけます",
                "あけません",
                "あけました",
                "あけませんでした"
              ],
              [
                "おしえる",
                "enseñar",
                "おしえます",
                "おしえません",
                "おしえました",
                "おしえませんでした"
              ]
            ]
          }
        ]
      },
      {
        "id": "grupo-1",
        "title": "Grupo 1",
        "titleJp": "いちグループ — terminan en う/つ/る/く/ぐ/す/ぬ/む/ぶ",
        "blocks": [
          {
            "kind": "text",
            "text": "Regla: la sílaba final U cambia a I + ます etc. (く→き、ぐ→ぎ、す→し、つ→ち、む→み、ぬ→に、ぶ→び、う→い、る→り)"
          },
          {
            "kind": "table",
            "headers": [
              "Infinitivo",
              "Significado",
              "ます(+)",
              "ます(−)",
              "ました(+)",
              "ました(−)"
            ],
            "rows": [
              [
                "はたらく",
                "trabajar",
                "はたらきます",
                "はたらきません",
                "はたらきました",
                "はたらきませんでした"
              ],
              [
                "おわる",
                "terminar",
                "おわります",
                "おわりません",
                "おわりました",
                "おわりませんでした"
              ],
              [
                "やすむ",
                "descansar",
                "やすみます",
                "やすみません",
                "やすみました",
                "やすみませんでした"
              ],
              [
                "うたう",
                "cantar",
                "うたいます",
                "うたいません",
                "うたいました",
                "うたいませんでした"
              ],
              [
                "まつ",
                "esperar",
                "まちます",
                "まちません",
                "まちました",
                "まちませんでした"
              ],
              [
                "かく",
                "escribir",
                "かきます",
                "かきません",
                "かきました",
                "かきませんでした"
              ],
              [
                "およぐ",
                "nadar",
                "およぎます",
                "およぎません",
                "およぎました",
                "およぎませんでした"
              ],
              [
                "はなす",
                "hablar",
                "はなします",
                "はなしません",
                "はなしました",
                "はなしませんでした"
              ],
              [
                "きく",
                "escuchar",
                "ききます",
                "ききません",
                "ききました",
                "ききませんでした"
              ],
              [
                "のむ",
                "beber",
                "のみます",
                "のみません",
                "のみました",
                "のみませんでした"
              ],
              [
                "あそぶ",
                "jugar",
                "あそびます",
                "あそびません",
                "あそびました",
                "あそびませんでした"
              ]
            ]
          }
        ]
      },
      {
        "id": "grupo-3",
        "title": "Grupo 3",
        "titleJp": "さんグループ — irregulares",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Infinitivo",
              "Significado",
              "ます(+)",
              "ます(−)",
              "ました(+)",
              "ました(−)"
            ],
            "rows": [
              [
                "する",
                "hacer",
                "します",
                "しません",
                "しました",
                "しませんでした"
              ],
              [
                "くる",
                "venir",
                "きます",
                "きません",
                "きました",
                "きませんでした"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "する + sustantivo = verbos compuestos: べんきょうする estudiar · しゅくだいする hacer la tarea · そうじする limpiar · でんわする llamar por teléfono · ゲームする jugar videojuegos · テニスする jugar al tenis"
          }
        ]
      },
      {
        "id": "como-identificar-el-grupo",
        "title": "¿Cómo identificar el grupo?",
        "blocks": [
          {
            "kind": "text",
            "text": "1. ¿Termina en ERU o IRU? → Sí: Grupo 2 2. ¿Es する o くる? → Sí: Grupo 3 3. Si no: Grupo 1"
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "まいにち はたらきます。",
                "Mainichi hatarakimasu.",
                "Trabajo todos los días."
              ],
              [
                "きのう べんきょうしました。",
                "Kinou benkyou shimashita.",
                "Ayer estudié."
              ],
              [
                "あした きません。",
                "Ashita kimasen.",
                "Mañana no vengo."
              ],
              [
                "どようびと にちようびは やすみました。",
                "Doyoubi to nichiyoubi wa yasumimashita.",
                "Descansé sábado y domingo."
              ],
              [
                "ゲームしませんでした。",
                "Geemu shimasendeshita.",
                "No jugué videojuegos."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-15",
    "number": 15,
    "title": "Días del mes, いつ y verbos de movimiento",
    "date": "2026-06-27",
    "topics": "lecturas especiales de los días del mes, いつ (¿cuándo?), fechas especiales, cumpleaños, verbos いく/くる/かえる, partícula へ.",
    "sections": [
      {
        "id": "dias-del-mes",
        "title": "Días del mes",
        "titleJp": "日 (ka / nichi)",
        "blocks": [
          {
            "kind": "text",
            "text": "Del 1 al 10 (y algunos más) son irregulares; desde el 11 casi todos son número + にち."
          },
          {
            "kind": "table",
            "headers": [
              "Día",
              "Kanji",
              "Lectura",
              "Nota"
            ],
            "rows": [
              [
                "1",
                "１日",
                "ついたち",
                "irregular"
              ],
              [
                "2",
                "２日",
                "ふつか",
                "irregular"
              ],
              [
                "3",
                "３日",
                "みっか",
                "irregular"
              ],
              [
                "4",
                "４日",
                "よっか",
                "irregular"
              ],
              [
                "5",
                "５日",
                "いつか",
                "irregular"
              ],
              [
                "6",
                "６日",
                "むいか",
                "irregular"
              ],
              [
                "7",
                "７日",
                "なのか",
                "irregular"
              ],
              [
                "8",
                "８日",
                "ようか",
                "irregular"
              ],
              [
                "9",
                "９日",
                "ここのか",
                "irregular"
              ],
              [
                "10",
                "１０日",
                "とおか",
                "irregular"
              ],
              [
                "14",
                "１４日",
                "じゅうよっか",
                "⚠️ よっか, no よんにち"
              ],
              [
                "20",
                "２０日",
                "はつか",
                "irregular"
              ],
              [
                "24",
                "２４日",
                "にじゅうよっか",
                "⚠️ よっか"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "El 4 y el 14 siempre usan よっか, nunca よんにち."
          }
        ]
      },
      {
        "id": "cuando",
        "title": "¿Cuándo?",
        "titleJp": "いつ",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "[cosa] は いつ ですか？ — ¿Cuándo es [cosa]?",
              "Respuesta: [mes]がつ [día]にち です。",
              "おたんじょうび は いつ ですか？ → たんじょうび は １２がつ １８にち です。"
            ]
          }
        ]
      },
      {
        "id": "fechas-especiales",
        "title": "Fechas especiales",
        "titleJp": "とくべつな ひ",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Evento",
              "Fecha",
              "En japonés"
            ],
            "rows": [
              [
                "クリスマス Navidad",
                "24 de diciembre",
                "１２がつ ２４にち"
              ],
              [
                "San Valentín",
                "14 de febrero",
                "２がつ １４にち"
              ],
              [
                "White Day",
                "14 de marzo",
                "３がつ １４にち"
              ],
              [
                "Día del niño (Argentina)",
                "18 de agosto",
                "８がつ １８にち"
              ],
              [
                "こどもの日 (Japón)",
                "5 de mayo",
                "５がつ ５にち"
              ],
              [
                "ひなまつり",
                "3 de marzo",
                "３がつ ３にち"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "こどもの日: se celebra con carpas de tela こいのぼり (fuerza y éxito). ひなまつり: festival de las muñecas, salud para las niñas."
          }
        ]
      },
      {
        "id": "cumpleanos",
        "title": "Cumpleaños",
        "titleJp": "たんじょうび",
        "blocks": [
          {
            "kind": "list",
            "items": [
              "たんじょうび (casual) · おたんじょうび (formal, con お)"
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "おたんじょうび は いつ ですか？ · なんがつ なんにち ですか？",
              "たんじょうび は ８がつ ２にち です。 — Mi cumpleaños es el 2 de agosto."
            ]
          }
        ]
      },
      {
        "id": "verbos-de-movimiento",
        "title": "Verbos de movimiento",
        "blocks": [
          {
            "kind": "text",
            "text": "Se usan con へ o に para el destino: [persona] は [lugar] へ/に [verbo]"
          },
          {
            "kind": "subheading",
            "text": "いく (ir) — Grupo 1"
          },
          {
            "kind": "text",
            "text": "いきます / いきません / いきました / いきませんでした"
          },
          {
            "kind": "quote",
            "lines": [
              "わたし は がっこう へ いきます。 — Voy a la escuela."
            ]
          },
          {
            "kind": "subheading",
            "text": "くる (venir) — Grupo 3 (irregular)"
          },
          {
            "kind": "text",
            "text": "きます / きません / きました / きませんでした"
          },
          {
            "kind": "quote",
            "lines": [
              "たなかくん は がっこう へ きます。 — Tanaka viene a la escuela."
            ]
          },
          {
            "kind": "subheading",
            "text": "かえる (regresar) — Grupo 1"
          },
          {
            "kind": "text",
            "text": "かえります / かえりません / かえりました / かえりませんでした"
          },
          {
            "kind": "quote",
            "lines": [
              "わたし は うち へ かえります。 — Regreso a casa."
            ]
          }
        ]
      },
      {
        "id": "particula-se-lee-e-direccion",
        "title": "Partícula へ (se lee \"e\") — dirección",
        "blocks": [
          {
            "kind": "text",
            "text": "へ = dirección (\"hacia\") · に = destino específico (\"a\"). Con verbos de movimiento suelen ser intercambiables."
          },
          {
            "kind": "quote",
            "lines": [
              "がっこう へ いきます。 / がっこう に いきます。"
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "おたんじょうび は いつ ですか？",
                "Otanjoubi wa itsu desu ka?",
                "¿Cuándo es tu cumpleaños?"
              ],
              [
                "たんじょうび は ３がつ ふつか です。",
                "Tanjoubi wa sangatsu futsuka desu.",
                "Mi cumpleaños es el 2 de marzo."
              ],
              [
                "なんがつ なんにち ですか？",
                "Nangatsu nannichi desu ka?",
                "¿Qué mes y qué día?"
              ],
              [
                "わたし は うち へ かえります。",
                "Watashi wa uchi e kaerimasu.",
                "Regreso a casa."
              ],
              [
                "きのう がっこう へ いきました。",
                "Kinou gakkou e ikimashita.",
                "Ayer fui a la escuela."
              ],
              [
                "いつ かえりますか？",
                "Itsu kaerimasu ka?",
                "¿Cuándo volvés?"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-16",
    "number": 16,
    "title": "¿Cómo y con quién vas?",
    "titleJp": "〜で・〜と・どこへも",
    "date": "2026-07-04",
    "topics": "repaso de へ いきます, かえります + から, どこ（へ）も con verbo negativo, expresiones de tiempo, medios de transporte con で, なんで, compañía con と, ひとりで, だれと, la oración completa.",
    "sections": [
      {
        "id": "repaso-de-la-tarea",
        "title": "Repaso de la tarea",
        "titleJp": "しゅくだい",
        "blocks": [
          {
            "kind": "text",
            "text": "Corrección de la página １２１, con la estructura [lugar] へ いきます."
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ゆうびんきょく へ いきます。",
                "Yuubinkyoku e ikimasu.",
                "Voy al correo."
              ],
              [
                "デパート へ いきます。",
                "Depaato e ikimasu.",
                "Voy a la tienda por departamentos."
              ],
              [
                "ぎんこう へ いきます。",
                "Ginkou e ikimasu.",
                "Voy al banco."
              ],
              [
                "びじゅつかん へ いきます。",
                "Bijutsukan e ikimasu.",
                "Voy al museo de arte."
              ]
            ]
          }
        ]
      },
      {
        "id": "regresar",
        "title": "Regresar",
        "titleJp": "かえります",
        "blocks": [
          {
            "kind": "text",
            "text": "かえる／かえります es volver al lugar al que uno pertenece: la casa, el país, la ciudad. El destino se marca con へ o に, igual que con いきます."
          },
          {
            "kind": "quote",
            "lines": [
              "[persona] は [lugar] へ/に かえります。",
              "メッシ は アルゼンチン へ かえります。 — Messi regresa a Argentina."
            ]
          },
          {
            "kind": "text",
            "text": "Para decir desde dónde vuelve se usa から."
          },
          {
            "kind": "quote",
            "lines": [
              "[origen] から [destino] へ かえります。",
              "メッシ は にほん から アルゼンチン へ かえります。 — Messi regresa de Japón a Argentina."
            ]
          }
        ]
      },
      {
        "id": "a-donde-vas",
        "title": "¿A dónde vas?",
        "titleJp": "どこ へ いきますか",
        "blocks": [
          {
            "kind": "text",
            "text": "Para preguntar el destino se usa どこ + へ／に."
          },
          {
            "kind": "quote",
            "lines": [
              "[persona]さん、どこ へ いきますか？ — ¿A dónde vas?"
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "わたし は かいしゃ へ いきます。",
                "Watashi wa kaisha e ikimasu.",
                "Voy a la empresa."
              ],
              [
                "わたし は デパート へ いきます。",
                "Watashi wa depaato e ikimasu.",
                "Voy a la tienda."
              ],
              [
                "わたし は スーパー へ いきます。",
                "Watashi wa suupaa e ikimasu.",
                "Voy al supermercado."
              ],
              [
                "わたし は としょかん へ いきます。",
                "Watashi wa toshokan e ikimasu.",
                "Voy a la biblioteca."
              ]
            ]
          }
        ]
      },
      {
        "id": "no-voy-a-ningun-lado",
        "title": "No voy a ningún lado",
        "titleJp": "どこ（へ）も",
        "blocks": [
          {
            "kind": "text",
            "text": "Cuando no vamos a ninguna parte se usa どこ（へ）も y el verbo va en negativo."
          },
          {
            "kind": "quote",
            "lines": [
              "ぎんこう へ いきません。 — No voy al banco.",
              "デパート へ いきません。 — No voy a la tienda.",
              "つまり、どこ[へ]も いきません。 — O sea, no voy a ningún lado."
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "Siempre que uses どこ（へ）も, el verbo tiene que estar en negativo. Nunca どこへも いきます."
          },
          {
            "kind": "text",
            "text": "つまり (tsumari) significa \"o sea\", \"es decir\": sirve para resumir lo que venías diciendo."
          }
        ]
      },
      {
        "id": "cuando",
        "title": "¿Cuándo?",
        "titleJp": "expresiones de tiempo",
        "blocks": [
          {
            "kind": "text",
            "text": "Van al principio de la oración y definen si el verbo va en ます (no-pasado) o ました (pasado)."
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "おととい",
                "ototoi",
                "anteayer"
              ],
              [
                "きのう",
                "kinou",
                "ayer"
              ],
              [
                "けさ",
                "kesa",
                "esta mañana"
              ],
              [
                "いま",
                "ima",
                "ahora"
              ],
              [
                "あした",
                "ashita",
                "mañana"
              ],
              [
                "せんしゅう",
                "senshuu",
                "la semana pasada"
              ],
              [
                "らいしゅう",
                "raishuu",
                "la semana que viene"
              ],
              [
                "せんげつ",
                "sengetsu",
                "el mes pasado"
              ],
              [
                "らいげつ",
                "raigetsu",
                "el mes que viene"
              ],
              [
                "きょねん",
                "kyonen",
                "el año pasado"
              ],
              [
                "まいにち",
                "mainichi",
                "todos los días"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "きのう デパート へ いきました。 — Ayer fui a la tienda.",
              "せんげつ ぎんこう へ いきました。 — El mes pasado fui al banco.",
              "らいしゅう びじゅつかん へ いきます。 — La semana que viene voy al museo.",
              "せんしゅう の にちようび、どこ へ いきましたか？ → おきなわ へ いきました。"
            ]
          }
        ]
      },
      {
        "id": "como",
        "title": "¿Cómo?",
        "titleJp": "medios de transporte + で",
        "blocks": [
          {
            "kind": "text",
            "text": "El medio de transporte se marca con で (\"en\" / \"por medio de\")."
          },
          {
            "kind": "quote",
            "lines": [
              "[persona] は [transporte] で [lugar] へ いきます。"
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ひこうき",
                "hikouki",
                "avión"
              ],
              [
                "しんかんせん",
                "shinkansen",
                "tren bala"
              ],
              [
                "でんしゃ",
                "densha",
                "tren"
              ],
              [
                "ちかてつ",
                "chikatetsu",
                "subte"
              ],
              [
                "バス",
                "basu",
                "colectivo"
              ],
              [
                "タクシー",
                "takushii",
                "taxi"
              ],
              [
                "くるま",
                "kuruma",
                "auto"
              ],
              [
                "じてんしゃ",
                "jitensha",
                "bicicleta"
              ],
              [
                "ふね",
                "fune",
                "barco"
              ],
              [
                "あるいて",
                "aruite",
                "caminando / a pie"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "わたし は じてんしゃ で がっこう へ いきます。 — Voy a la escuela en bicicleta.",
              "わたし は バス で うち へ かえります。 — Vuelvo a casa en colectivo."
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "あるいて es la excepción y NO lleva で. Se dice あるいて かえりました, nunca あるいてで."
          },
          {
            "kind": "quote",
            "lines": [
              "きのう あるいて かえりました。 — Ayer volví caminando."
            ]
          }
        ]
      },
      {
        "id": "en-que-vas",
        "title": "¿En qué vas?",
        "titleJp": "なん で いきますか",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "[persona]さん は なん で [lugar] へ いきますか？ — ¿En qué va [persona] a [lugar]?",
              "たなかさん は なん で かいしゃ へ いきますか？ → くるま で いきます。"
            ]
          }
        ]
      },
      {
        "id": "con-quien",
        "title": "¿Con quién?",
        "titleJp": "〜と / ひとりで",
        "blocks": [
          {
            "kind": "text",
            "text": "La compañía se marca con と (\"con\")."
          },
          {
            "kind": "quote",
            "lines": [
              "[persona] は [compañía] と [lugar] へ いきます。"
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ともだち",
                "tomodachi",
                "amigo/a"
              ],
              [
                "かぞく",
                "kazoku",
                "familia"
              ],
              [
                "かれし",
                "kareshi",
                "novio"
              ],
              [
                "かのじょ",
                "kanojo",
                "novia"
              ],
              [
                "ひとり",
                "hitori",
                "una sola persona / solo"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "うさぎちゃん は かれし と とうきょう へ いきます。 — Usagi va a Tokio con su novio.",
              "まもるちゃん は かのじょ と とうきょう へ いきます。 — Mamoru va a Tokio con su novia."
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "Cuando vas solo/a no se usa と sino ひとり で."
          },
          {
            "kind": "quote",
            "lines": [
              "ジョン・トラボルタさん は ひとり で きょうしつ へ きました。 — John Travolta vino solo al aula."
            ]
          },
          {
            "kind": "text",
            "text": "Para preguntar con quién se usa だれ と."
          },
          {
            "kind": "quote",
            "lines": [
              "ホーマーさん は だれ と スプリングフィールド へ かえりますか？ → かぞく と かえります。",
              "スポンジ・ボブさん は だれ と ビキニタウン へ かえりますか？ → ともだち と かえります。"
            ]
          }
        ]
      },
      {
        "id": "la-oracion-completa",
        "title": "La oración completa",
        "titleJp": "orden de los componentes",
        "blocks": [
          {
            "kind": "text",
            "text": "El orden es siempre el mismo y el verbo queda al final."
          },
          {
            "kind": "quote",
            "lines": [
              "[persona] は [tiempo] [compañía] と [transporte] で [lugar] へ [verbo]"
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ルフィちゃん は まいにち ともだち と ふね で ほっかいどう へ いきます。",
                "Rufi-chan wa mainichi tomodachi to fune de Hokkaidou e ikimasu.",
                "Luffy va todos los días a Hokkaido en barco con sus amigos."
              ],
              [
                "たんじろくん は ６じ に ともだち と でんしゃ で おおさかじょう へ いきます。",
                "Tanjirou-kun wa rokuji ni tomodachi to densha de Oosakajou e ikimasu.",
                "Tanjiro va al castillo de Osaka a las 6 en tren con sus amigos."
              ],
              [
                "トトロ は いま ひとり で ねこバス で もり へ いきます。",
                "Totoro wa ima hitori de nekobasu de mori e ikimasu.",
                "Totoro va ahora solo al bosque en el gatobús."
              ],
              [
                "ききちゃん は あさ ９じ から ごご ４じ まで ジジ と ほうき で きょうと へ いきます。",
                "Kiki-chan wa asa kuji kara gogo yoji made Jiji to houki de Kyouto e ikimasu.",
                "Kiki va a Kioto en escoba con Jiji, de 9 a 16."
              ],
              [
                "さつきちゃん は いま めいちゃん と ねこバス で いなか から しちこくやまびょういん まで いきます。",
                "Satsuki-chan wa ima Mei-chan to nekobasu de inaka kara Shichikokuyama byouin made ikimasu.",
                "Satsuki va ahora con Mei, en el gatobús, del campo al hospital de Shichikokuyama."
              ]
            ]
          },
          {
            "kind": "text",
            "text": "から〜まで también funciona con lugares, no solo con horas y días: marca el tramo de origen a destino."
          },
          {
            "kind": "note",
            "tone": "📝",
            "text": "Tarea: みんな の にほんご — ４３ページ、もんだい ３ と ４."
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "どこ へ いきますか？",
                "Doko e ikimasu ka?",
                "¿A dónde vas?"
              ],
              [
                "どこ[へ]も いきません。",
                "Doko[e]mo ikimasen.",
                "No voy a ningún lado."
              ],
              [
                "なん で いきますか？",
                "Nan de ikimasu ka?",
                "¿En qué vas?"
              ],
              [
                "でんしゃ で いきます。",
                "Densha de ikimasu.",
                "Voy en tren."
              ],
              [
                "あるいて かえりました。",
                "Aruite kaerimashita.",
                "Volví caminando."
              ],
              [
                "だれ と いきますか？",
                "Dare to ikimasu ka?",
                "¿Con quién vas?"
              ],
              [
                "ともだち と いきます。",
                "Tomodachi to ikimasu.",
                "Voy con un amigo."
              ],
              [
                "ひとり で いきます。",
                "Hitori de ikimasu.",
                "Voy solo/a."
              ],
              [
                "きのう どこ へ いきましたか？",
                "Kinou doko e ikimashita ka?",
                "¿A dónde fuiste ayer?"
              ],
              [
                "にほん から アルゼンチン へ かえります。",
                "Nihon kara Aruzenchin e kaerimasu.",
                "Vuelvo de Japón a Argentina."
              ]
            ]
          }
        ]
      }
    ]
  }
];

export const QUICK_REVIEW: ClassNote = {
  "id": "repaso",
  "number": 0,
  "title": "lo esencial",
  "date": "2026-08-08",
  "topics": "partículas, です y su pasado, demostrativos, preguntas, números, hora y fechas, verbos, estructura de la oración.",
  "sections": [
    {
      "id": "general",
      "title": "General",
      "blocks": [
        {
          "kind": "text",
          "text": "Hoja de repaso rápido. Consolida lo más usado de las clases 1 a 16. Cuando entra una clase nueva, lo que se repite acá se actualiza y lo que es nuevo se suma."
        }
      ]
    },
    {
      "id": "estructura-de-la-oracion",
      "title": "Estructura de la oración",
      "blocks": [
        {
          "kind": "text",
          "text": "El japonés es Sujeto → Objeto → Verbo. El verbo va siempre al final."
        },
        {
          "kind": "quote",
          "lines": [
            "たなかさん は にほんじん です。 — La señora Tanaka es japonesa.",
            "[persona] は [tiempo] [compañía] と [transporte] で [lugar] へ [verbo]",
            "ルフィちゃん は まいにち ともだち と ふね で ほっかいどう へ いきます。"
          ]
        },
        {
          "kind": "note",
          "tone": "⚠️",
          "text": "Las partículas van SIEMPRE después de la palabra a la que se refieren."
        }
      ]
    },
    {
      "id": "particulas",
      "title": "Partículas",
      "blocks": [
        {
          "kind": "table",
          "headers": [
            "Partícula",
            "Función",
            "Ejemplo"
          ],
          "rows": [
            [
              "は (wa)",
              "marca el TEMA (no el sujeto)",
              "わたし は マティアス です。"
            ],
            [
              "か",
              "convierte la oración en pregunta",
              "がくせい ですか？"
            ],
            [
              "も",
              "también / tampoco (reemplaza a は)",
              "わたし も がくせい です。"
            ],
            [
              "の",
              "posesión o relación entre sustantivos",
              "わたし の ほん — mi libro"
            ],
            [
              "に",
              "hora exacta / destino específico",
              "８じ に おきます。"
            ],
            [
              "へ (e)",
              "dirección del movimiento",
              "がっこう へ いきます。"
            ],
            [
              "で",
              "medio de transporte / instrumento",
              "でんしゃ で いきます。"
            ],
            [
              "と",
              "compañía (\"con\")",
              "ともだち と いきます。"
            ],
            [
              "から",
              "desde (origen, hora, día)",
              "９じ から はたらきます。"
            ],
            [
              "まで",
              "hasta",
              "６じ まで はたらきます。"
            ],
            [
              "を (o)",
              "objeto directo",
              "—"
            ]
          ]
        },
        {
          "kind": "note",
          "tone": "⚠️",
          "text": "に NO se usa con まいにち, きのう, きょう, あした. Esas palabras van solas."
        },
        {
          "kind": "note",
          "tone": "⚠️",
          "text": "あるいて (a pie) NO lleva で."
        },
        {
          "kind": "note",
          "tone": "⚠️",
          "text": "ひとり lleva で, no と: ひとり で いきます。"
        }
      ]
    },
    {
      "id": "y-su-pasado",
      "title": "です y su pasado",
      "blocks": [
        {
          "kind": "table",
          "headers": [
            "Tiempo",
            "Positivo",
            "Negativo"
          ],
          "rows": [
            [
              "Presente",
              "です",
              "じゃありません"
            ],
            [
              "Pasado",
              "でした",
              "じゃありませんでした"
            ]
          ]
        },
        {
          "kind": "quote",
          "lines": [
            "きのう は きんようび でした。 — Ayer fue viernes.",
            "おととい は げつようび じゃありませんでした。 — Anteayer no fue lunes."
          ]
        }
      ]
    },
    {
      "id": "demostrativos",
      "title": "Demostrativos",
      "blocks": [
        {
          "kind": "table",
          "headers": [
            "Cerca de mí",
            "Cerca tuyo",
            "Lejos de ambos",
            "Pregunta"
          ],
          "rows": [
            [
              "これ",
              "それ",
              "あれ",
              "どれ"
            ],
            [
              "この + sust.",
              "その + sust.",
              "あの + sust.",
              "どの + sust."
            ],
            [
              "ここ",
              "そこ",
              "あそこ",
              "どこ"
            ],
            [
              "こちら",
              "そちら",
              "あちら",
              "どちら"
            ]
          ]
        },
        {
          "kind": "text",
          "text": "これ/それ/あれ son pronombres (van solos). この/その/あの son adjetivos (van con un sustantivo). こちら/そちら/あちら/どちら es la versión formal, también sirve para \"¿de qué país/empresa?\"."
        }
      ]
    },
    {
      "id": "preguntas-frecuentes",
      "title": "Preguntas frecuentes",
      "blocks": [
        {
          "kind": "table",
          "headers": [
            "Japonés",
            "Romaji",
            "Español"
          ],
          "rows": [
            [
              "おなまえは？",
              "Onamae wa?",
              "¿Cómo te llamás?"
            ],
            [
              "おくには？",
              "Okuni wa?",
              "¿De qué país sos?"
            ],
            [
              "おしごとは？",
              "Oshigoto wa?",
              "¿A qué te dedicás?"
            ],
            [
              "ごしゅみは？",
              "Go shumi wa?",
              "¿Cuál es tu hobby?"
            ],
            [
              "おいくつですか？",
              "Oikutsu desu ka?",
              "¿Cuántos años tenés?"
            ],
            [
              "いくら ですか？",
              "Ikura desu ka?",
              "¿Cuánto cuesta?"
            ],
            [
              "なんじ ですか？",
              "Nanji desu ka?",
              "¿Qué hora es?"
            ],
            [
              "なんようび ですか？",
              "Nanyoubi desu ka?",
              "¿Qué día es?"
            ],
            [
              "いつ ですか？",
              "Itsu desu ka?",
              "¿Cuándo es?"
            ],
            [
              "どこ へ いきますか？",
              "Doko e ikimasu ka?",
              "¿A dónde vas?"
            ],
            [
              "なん で いきますか？",
              "Nan de ikimasu ka?",
              "¿En qué vas?"
            ],
            [
              "だれ と いきますか？",
              "Dare to ikimasu ka?",
              "¿Con quién vas?"
            ]
          ]
        }
      ]
    },
    {
      "id": "numeros",
      "title": "Números",
      "blocks": [
        {
          "kind": "text",
          "text": "1 いち · 2 に · 3 さん · 4 よん/し · 5 ご · 6 ろく · 7 なな/しち · 8 はち · 9 きゅう/く · 10 じゅう"
        },
        {
          "kind": "list",
          "items": [
            "Del 11 al 99: じゅう + unidad (11 じゅういち), decenas = número + じゅう (20 にじゅう).",
            "100 ひゃく · 1.000 せん · 10.000 まん"
          ]
        },
        {
          "kind": "note",
          "tone": "⚠️",
          "text": "Irregulares: 300 さんびゃく · 600 ろっぴゃく · 800 はっぴゃく · 3.000 さんぜん · 8.000 はっせん"
        }
      ]
    },
    {
      "id": "la-hora",
      "title": "La hora",
      "blocks": [
        {
          "kind": "text",
          "text": "Hora = número + じ. Minutos = número + ふん/ぷん. \"y media\" = はん."
        },
        {
          "kind": "note",
          "tone": "⚠️",
          "text": "Horas irregulares: 4 よじ · 7 しちじ · 9 くじ"
        },
        {
          "kind": "note",
          "tone": "⚠️",
          "text": "Minutos con ぷん: 1, 3, 4, 6, 8, 10 (いっぷん, さんぷん, よんぷん, ろっぷん, はっぷん, じゅっぷん)"
        },
        {
          "kind": "quote",
          "lines": [
            "いま なんじ ですか？ → ７じ４５ふん です。",
            "９じ から ６じ まで はたらきます。 — Trabajo de 9 a 6."
          ]
        }
      ]
    },
    {
      "id": "dias-meses-y-fechas",
      "title": "Días, meses y fechas",
      "blocks": [
        {
          "kind": "text",
          "text": "Días: げつ・か・すい・もく・きん・ど・にち + ようび Meses: número + がつ (⚠️ 4 しがつ · 7 しちがつ · 9 くがつ) Años: número + ねん"
        },
        {
          "kind": "text",
          "text": "Días del mes irregulares: 1 ついたち · 2 ふつか · 3 みっか · 4 よっか · 5 いつか · 6 むいか · 7 なのか · 8 ようか · 9 ここのか · 10 とおか · 14 じゅうよっか · 20 はつか Desde el 11, casi todos: número + にち."
        }
      ]
    },
    {
      "id": "vocabulario-de-tiempo",
      "title": "Vocabulario de tiempo",
      "blocks": [
        {
          "kind": "table",
          "headers": [
            "Japonés",
            "Romaji",
            "Español"
          ],
          "rows": [
            [
              "おととい",
              "ototoi",
              "anteayer"
            ],
            [
              "きのう",
              "kinou",
              "ayer"
            ],
            [
              "きょう",
              "kyou",
              "hoy"
            ],
            [
              "あした",
              "ashita",
              "mañana"
            ],
            [
              "あさって",
              "asatte",
              "pasado mañana"
            ],
            [
              "けさ",
              "kesa",
              "esta mañana"
            ],
            [
              "こんばん",
              "konban",
              "esta noche"
            ],
            [
              "まいにち",
              "mainichi",
              "todos los días"
            ],
            [
              "せんしゅう / らいしゅう",
              "senshuu / raishuu",
              "la semana pasada / que viene"
            ],
            [
              "せんげつ / らいげつ",
              "sengetsu / raigetsu",
              "el mes pasado / que viene"
            ],
            [
              "きょねん / らいねん",
              "kyonen / rainen",
              "el año pasado / que viene"
            ]
          ]
        }
      ]
    },
    {
      "id": "verbos-los-3-grupos",
      "title": "Verbos — los 3 grupos",
      "blocks": [
        {
          "kind": "table",
          "headers": [
            "Grupo",
            "Regla",
            "Ejemplo"
          ],
          "rows": [
            [
              "1グループ",
              "la sílaba final en U pasa a I + ます",
              "はたらく → はたらきます"
            ],
            [
              "2グループ",
              "termina en ERU/IRU: se saca る + ます",
              "たべる → たべます"
            ],
            [
              "3グループ",
              "irregulares: する y くる",
              "する → します · くる → きます"
            ]
          ]
        },
        {
          "kind": "text",
          "text": "Identificación: ¿termina en ERU o IRU? → Grupo 2. ¿Es する o くる? → Grupo 3. Si no → Grupo 1."
        },
        {
          "kind": "table",
          "headers": [
            "Tiempo",
            "Forma"
          ],
          "rows": [
            [
              "Presente positivo",
              "～ます"
            ],
            [
              "Presente negativo",
              "～ません"
            ],
            [
              "Pasado positivo",
              "～ました"
            ],
            [
              "Pasado negativo",
              "～ませんでした"
            ]
          ]
        }
      ]
    },
    {
      "id": "verbos-mas-usados",
      "title": "Verbos más usados",
      "blocks": [
        {
          "kind": "table",
          "headers": [
            "Japonés",
            "Romaji",
            "Español"
          ],
          "rows": [
            [
              "いきます",
              "ikimasu",
              "ir"
            ],
            [
              "きます",
              "kimasu",
              "venir"
            ],
            [
              "かえります",
              "kaerimasu",
              "volver / regresar"
            ],
            [
              "おきます",
              "okimasu",
              "levantarse"
            ],
            [
              "ねます",
              "nemasu",
              "dormir"
            ],
            [
              "はたらきます",
              "hatarakimasu",
              "trabajar"
            ],
            [
              "べんきょうします",
              "benkyou shimasu",
              "estudiar"
            ],
            [
              "おわります",
              "owarimasu",
              "terminar"
            ],
            [
              "はじまります",
              "hajimarimasu",
              "empezar"
            ],
            [
              "やすみます",
              "yasumimasu",
              "descansar"
            ]
          ]
        }
      ]
    },
    {
      "id": "frases-esenciales",
      "title": "Frases esenciales",
      "blocks": [
        {
          "kind": "table",
          "headers": [
            "Japonés",
            "Romaji",
            "Español"
          ],
          "rows": [
            [
              "はじめまして！",
              "Hajimemashite!",
              "¡Mucho gusto!"
            ],
            [
              "どうぞよろしくおねがいします。",
              "Douzo yoroshiku onegai shimasu.",
              "Encantado/a."
            ],
            [
              "もう いちど おねがいします。",
              "Mou ichido onegai shimasu.",
              "Otra vez, por favor."
            ],
            [
              "ゆっくり おねがいします。",
              "Yukkuri onegai shimasu.",
              "Más despacio, por favor."
            ],
            [
              "わかりません。",
              "Wakarimasen.",
              "No entiendo."
            ],
            [
              "すみません。",
              "Sumimasen.",
              "Perdón / disculpe."
            ],
            [
              "おつかれさまでした。",
              "Otsukaresama deshita.",
              "Buen trabajo el de hoy."
            ]
          ]
        }
      ]
    }
  ]
};
