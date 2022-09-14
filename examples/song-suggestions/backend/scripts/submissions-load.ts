import {assert} from "https://deno.land/std/testing/asserts.ts";


const YOUTUBE_SONGS = [
  "https://www.youtube.com/watch?v=s8SPQwi1eRw&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=1",
  "https://www.youtube.com/watch?v=pYURTzyV1X4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=2",
  "https://www.youtube.com/watch?v=qRg_CQUq5po&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=3",
  "https://www.youtube.com/watch?v=RSK38I_5L7c&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=4",
  "https://www.youtube.com/watch?v=sOeHby2ic30&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=5",
  "https://www.youtube.com/watch?v=RkICLrxOEgQ&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=6",
  "https://www.youtube.com/watch?v=wU24QhCfrMU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=7",
  "https://www.youtube.com/watch?v=9ONNL0kb_SE&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=8",
  "https://www.youtube.com/watch?v=6yFvBP-iZJA&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=9",
  "https://www.youtube.com/watch?v=iP44QStzYAg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=10",
  "https://www.youtube.com/watch?v=_2kVjZtz94A&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=11",
  "https://www.youtube.com/watch?v=WqNxlRBNNpY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=12",
  "https://www.youtube.com/watch?v=FTYZMAjUdtg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=13",
  "https://www.youtube.com/watch?v=23dBTQlrpIo&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=14",
  "https://www.youtube.com/watch?v=Bz7CVq6OGOg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=15",
  "https://www.youtube.com/watch?v=2G3UPYTpz4o&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=16",
  "https://www.youtube.com/watch?v=UOM7e9ugMgA&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=17",
  "https://www.youtube.com/watch?v=Tb8CLj3NLow&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=18",
  "https://www.youtube.com/watch?v=PcVj1F8PzO8&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=19",
  "https://www.youtube.com/watch?v=8s2nmNcoIL0&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=20",
  "https://www.youtube.com/watch?v=uBPqNq-9n78&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=21",
  "https://www.youtube.com/watch?v=t4zMSRD1CQY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=22",
  "https://www.youtube.com/watch?v=ZN9-Xk6NMPg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=23",
  "https://www.youtube.com/watch?v=xSd7jaSiVgY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=24",
  "https://www.youtube.com/watch?v=_K19NPelhQ8&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=25",
  "https://www.youtube.com/watch?v=vB338i6R27A&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=26",
  "https://www.youtube.com/watch?v=Z4_GtsbzBIk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=27",
  "https://www.youtube.com/watch?v=meoNKLZ6AIU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=28",
  "https://www.youtube.com/watch?v=-Z3cwQEX-RQ&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=29",
  "https://www.youtube.com/watch?v=kkqhqQBcULM&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=30",
  "https://www.youtube.com/watch?v=lnN2GcPBW4Q&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=31",
  "https://www.youtube.com/watch?v=xRTN1L9NWB0&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=32",
  "https://www.youtube.com/watch?v=xGbJ1IwWlZk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=33",
  "https://www.youtube.com/watch?v=Pdkezi7Ww2c&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=34",
  "https://www.youtube.com/watch?v=KPvwhaRy7Ag&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=35",
  "https://www.youtube.com/watch?v=N56iMlVGCxY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=36",
  "https://www.youtube.com/watch?v=e5SCJ1WkgG4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=37",
  "https://www.youtube.com/watch?v=fwXGTRXxenY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=38",
  "https://www.youtube.com/watch?v=exWKq8MQ-KA&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=39",
  "https://www.youtube.com/watch?v=GvYOyNcKwLg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=40",
  "https://www.youtube.com/watch?v=E5r9Ue6JV3M&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=41",
  "https://www.youtube.com/watch?v=jyJL5EU06LU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=42",
  "https://www.youtube.com/watch?v=xnqeSi70QJg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=43",
  "https://www.youtube.com/watch?v=rvk7Y03X_zY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=44",
  "https://www.youtube.com/watch?v=nfYa-dkWDzM&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=45",
  "https://www.youtube.com/watch?v=lww284PYHmU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=46",
  "https://www.youtube.com/watch?v=U4eBOafDIHM&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=47",
  "https://www.youtube.com/watch?v=LM-k7HDHyQc&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=48",
  "https://www.youtube.com/watch?v=mqhlpVmzGnY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=49",
  "https://www.youtube.com/watch?v=c5I8IJFv6iU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=50",
  "https://www.youtube.com/watch?v=IaJfNaEoh9A&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=51",
  "https://www.youtube.com/watch?v=3Q1xi1PuqrM&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=52",
  "https://www.youtube.com/watch?v=NFNbtTm4vVI&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=53",
  "https://www.youtube.com/watch?v=jXbsFUn0MfY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=54",
  "https://www.youtube.com/watch?v=vbp76oHwJaI&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=55",
  "https://www.youtube.com/watch?v=rU4AZGQ5PKo&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=56",
  "https://www.youtube.com/watch?v=tCLFT1X2nCU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=57",
  "https://www.youtube.com/watch?v=Du28C0JhqN0&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=58",
  "https://www.youtube.com/watch?v=c1Yfbf2wfI8&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=59",
  "https://www.youtube.com/watch?v=6udshpniaAo&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=60",
  "https://www.youtube.com/watch?v=xUxPcxK6tvI&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=61",
  "https://www.youtube.com/watch?v=tL0QGj15PPA&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=62",
  "https://www.youtube.com/watch?v=iaBaeB-ALY0&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=63",
  "https://www.youtube.com/watch?v=IBBt9OOhGv8&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=64",
  "https://www.youtube.com/watch?v=XPZOaVd1tNQ&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=65",
  "https://www.youtube.com/watch?v=K1rG8XrSlyg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=66",
  "https://www.youtube.com/watch?v=pz-CkIPfIic&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=67",
  "https://www.youtube.com/watch?v=Jv8XoN5JAac&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=68",
  "https://www.youtube.com/watch?v=ew7skUvzHI4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=69",
  "https://www.youtube.com/watch?v=5Dzq13pBAHs&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=70",
  "https://www.youtube.com/watch?v=jMY2Ng6ZA7s&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=71",
  "https://www.youtube.com/watch?v=fQvEp2L2XDk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=72",
  "https://www.youtube.com/watch?v=kTD5QFTymJI&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=73",
  "https://www.youtube.com/watch?v=eKhQ87B8p7A&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=74",
  "https://www.youtube.com/watch?v=1M5YgaFFAmA&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=75",
  "https://www.youtube.com/watch?v=ZkJRJsefVgI&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=76",
  "https://www.youtube.com/watch?v=Pb_ELM0ewsY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=77",
  "https://www.youtube.com/watch?v=tywcYCBd8FU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=78",
  "https://www.youtube.com/watch?v=pQyzZGuGCjM&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=79",
  "https://www.youtube.com/watch?v=0wYB015KUkg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=80",
  "https://www.youtube.com/watch?v=UejeKK45zjw&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=81",
  "https://www.youtube.com/watch?v=iDECHrH8BFk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=82",
  "https://www.youtube.com/watch?v=6r6XO2Cc5QQ&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=83",
  "https://www.youtube.com/watch?v=hDy7_VXDBcM&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=84",
  "https://www.youtube.com/watch?v=AmXuwFkSIzA&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=85",
  "https://www.youtube.com/watch?v=Xpj39q1Cn-4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=86",
  "https://www.youtube.com/watch?v=_KORpE2-0ZM&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=87",
  "https://www.youtube.com/watch?v=3FJ1tb3bXCQ&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=88",
  "https://www.youtube.com/watch?v=QMlsiqw11bk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=89",
  "https://www.youtube.com/watch?v=e6Fqz4wRGAk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=90",
  "https://www.youtube.com/watch?v=pVl6pj-4SGo&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=91",
  "https://www.youtube.com/watch?v=gDcg8CIdLR4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=92",
  "https://www.youtube.com/watch?v=CTALvQIDV68&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=93",
  "https://www.youtube.com/watch?v=3MHjonejcRI&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=94",
  "https://www.youtube.com/watch?v=ij3RnryWsZk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=95",
  "https://www.youtube.com/watch?v=WWTE88Xrbbo&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=96",
  "https://www.youtube.com/watch?v=iVIcI9673mc&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=97",
  "https://www.youtube.com/watch?v=82Btob1cKoI&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=98",
  "https://www.youtube.com/watch?v=IplF-4zWna0&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=99",
  "https://www.youtube.com/watch?v=sKEjhnNNpBs&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=100",
  "https://www.youtube.com/watch?v=dvu100HIgvQ&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=101",
  "https://www.youtube.com/watch?v=P26JK6eR824&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=102",
  "https://www.youtube.com/watch?v=PQzBmjL3Ia0&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=103",
  "https://www.youtube.com/watch?v=aJq1kTa1Qxg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=104",
  "https://www.youtube.com/watch?v=Aba1YdvZJzk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=105",
  "https://www.youtube.com/watch?v=xP086a6ff8o&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=106",
  "https://www.youtube.com/watch?v=mS2S2f8yOxE&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=107",
  "https://www.youtube.com/watch?v=DgWLDfC4dYM&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=108",
  "https://www.youtube.com/watch?v=m-854i_XSk8&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=109",
  "https://www.youtube.com/watch?v=tzYIHzV3gq4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=110",
  "https://www.youtube.com/watch?v=-IKJHxM0HA0&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=111",
  "https://www.youtube.com/watch?v=Sm_PTRXjs5g&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=112",
  "https://www.youtube.com/watch?v=LVnvyklG47s&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=113",
  "https://www.youtube.com/watch?v=Ouwtng35j-M&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=114",
  "https://www.youtube.com/watch?v=czjokOkOMpY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=115",
  "https://www.youtube.com/watch?v=u9tIqumc77s&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=116",
  "https://www.youtube.com/watch?v=XBvg_8OBmC8&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=117",
  "https://www.youtube.com/watch?v=8q7etp0IdOw&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=118",
  "https://www.youtube.com/watch?v=-A_xfFB8np8&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=119",
  "https://www.youtube.com/watch?v=cjViBaAOwFg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=120",
  "https://www.youtube.com/watch?v=WQ1_XQ4ie44&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=121",
  "https://www.youtube.com/watch?v=yPsO0mPpyUU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=122",
  "https://www.youtube.com/watch?v=1Sz7h_iw22Y&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=123",
  "https://www.youtube.com/watch?v=2SJ3zPg3hLA&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=124",
  "https://www.youtube.com/watch?v=niaXZhh4NTg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=125",
  "https://www.youtube.com/watch?v=1RduuHE0U2E&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=126",
  "https://www.youtube.com/watch?v=Y9oI8IcVv80&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=127",
  "https://www.youtube.com/watch?v=4fhPviVw3ZU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=128",
  "https://www.youtube.com/watch?v=wC2rEPV91wQ&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=129",
  "https://www.youtube.com/watch?v=3Jek0BrZmxY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=130",
  "https://www.youtube.com/watch?v=8vo8NoD9woU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=131",
  "https://www.youtube.com/watch?v=897fN6bhcgA&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=132",
  "https://www.youtube.com/watch?v=eMueUUfbJOU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=133",
  "https://www.youtube.com/watch?v=sLNb9o2ejpw&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=134",
  "https://www.youtube.com/watch?v=YffC0bFJp04&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=135",
  "https://www.youtube.com/watch?v=7hRDA8Drrbw&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=136",
  "https://www.youtube.com/watch?v=ABL-sxOubgM&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=137",
  "https://www.youtube.com/watch?v=XP-kJxjbohM&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=138",
  "https://www.youtube.com/watch?v=31Ib7C2a1lY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=139",
  "https://www.youtube.com/watch?v=YQatKZw0h00&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=140",
  "https://www.youtube.com/watch?v=Q24Xa4Nl6oc&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=141",
  "https://www.youtube.com/watch?v=VU_GCnGNYzo&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=142",
  "https://www.youtube.com/watch?v=WEnHqcE3-Hk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=143",
  "https://www.youtube.com/watch?v=Md110cym4WI&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=144",
  "https://www.youtube.com/watch?v=xxDw9mSD604&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=145",
  "https://www.youtube.com/watch?v=zas0Vft2MR4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=146",
  "https://www.youtube.com/watch?v=HfQLDEFAryc&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=147",
  "https://www.youtube.com/watch?v=Ds0KlLyibE0&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=148",
  "https://www.youtube.com/watch?v=-vYZLk8H74g&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=149",
  "https://www.youtube.com/watch?v=vNfyQzzwpMA&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=150",
  "https://www.youtube.com/watch?v=JfKT7K8lKOE&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=151",
  "https://www.youtube.com/watch?v=KUukdH7BVWc&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=152",
  "https://www.youtube.com/watch?v=lMMeQPeq-FE&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=153",
  "https://www.youtube.com/watch?v=RujMtZWpfZA&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=154",
  "https://www.youtube.com/watch?v=AOT7YDL1t4w&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=155",
  "https://www.youtube.com/watch?v=wQVDV8JCHlk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=156",
  "https://www.youtube.com/watch?v=6zKOEhEt4G4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=157",
  "https://www.youtube.com/watch?v=3jxmCa434F0&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=158",
  "https://www.youtube.com/watch?v=4Qszw69ges8&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=159",
  "https://www.youtube.com/watch?v=Dx239tx07V4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=160",
  "https://www.youtube.com/watch?v=RYoJ0zcQmCQ&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=161",
  "https://www.youtube.com/watch?v=Do267MMCZtk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=162",
  "https://www.youtube.com/watch?v=RUF1nTs_Zd4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=163",
  "https://www.youtube.com/watch?v=dlmP84u0Vv4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=164",
  "https://www.youtube.com/watch?v=bNoU-oizH-s&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=165",
  "https://www.youtube.com/watch?v=qUN3E_qnSQY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=166",
  "https://www.youtube.com/watch?v=WVH4Nl2AF0w&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=167",
  "https://www.youtube.com/watch?v=WZBjLYToS0I&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=168",
  "https://www.youtube.com/watch?v=szp901GwuBc&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=169",
  "https://www.youtube.com/watch?v=oC7J-Skubco&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=170",
  "https://www.youtube.com/watch?v=x72Exbd190E&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=171",
  "https://www.youtube.com/watch?v=kMV0FkCJdGk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=172",
  "https://www.youtube.com/watch?v=60JevCibNn4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=173",
  "https://www.youtube.com/watch?v=AucnltW-whg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=174",
  "https://www.youtube.com/watch?v=kULsf2CoB-k&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=175",
  "https://www.youtube.com/watch?v=u0wiWTT5yjc&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=176",
  "https://www.youtube.com/watch?v=SxtNCY5VUV0&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=177",
  "https://www.youtube.com/watch?v=U3GcCESrxoM&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=178",
  "https://www.youtube.com/watch?v=MrOLtTpECJc&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=179",
  "https://www.youtube.com/watch?v=KfiFnTPFTPo&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=180",
  "https://www.youtube.com/watch?v=QUx_tFJ5trc&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=181",
  "https://www.youtube.com/watch?v=zqEQrGCROBA&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=182",
  "https://www.youtube.com/watch?v=GKm79BUVWgg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=183",
  "https://www.youtube.com/watch?v=u97jsWoMZOk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=184",
  "https://www.youtube.com/watch?v=R3pNTs7CI3k&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=185",
  "https://www.youtube.com/watch?v=2acKmh7Aeac&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=186",
  "https://www.youtube.com/watch?v=sCShtS34coY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=187",
  "https://www.youtube.com/watch?v=W_SE0-p4Eqo&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=188",
  "https://www.youtube.com/watch?v=GHRmDJayVR8&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=189",
  "https://www.youtube.com/watch?v=uJlymQzNuQQ&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=190",
  "https://www.youtube.com/watch?v=wTTClc7uvd4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=191",
  "https://www.youtube.com/watch?v=RCqNXtTq-oU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=192",
  "https://www.youtube.com/watch?v=fSwHud1hnfE&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=193",
  "https://www.youtube.com/watch?v=eP89IfY048Q&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=194",
  "https://www.youtube.com/watch?v=re6UoG5nG3U&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=195",
  "https://www.youtube.com/watch?v=-U-YpG4GFps&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=196",
  "https://www.youtube.com/watch?v=94_krh_JUWY&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=197",
  "https://www.youtube.com/watch?v=VppBnajGf44&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=198",
  "https://www.youtube.com/watch?v=sBSpDpzDDVE&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=199",
  "https://www.youtube.com/watch?v=QBKz5WEAiJg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=200",
  "https://www.youtube.com/watch?v=SWEwW6hLjdU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=201",
  "https://www.youtube.com/watch?v=J4EhUivLemM&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=202",
  "https://www.youtube.com/watch?v=Y_9E10Z2IYg&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=203",
  "https://www.youtube.com/watch?v=bxlk-lMtUkU&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=204",
  "https://www.youtube.com/watch?v=KrUJCZVmRAo&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=205",
  "https://www.youtube.com/watch?v=GxQ1SiR0r_4&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=206",
  "https://www.youtube.com/watch?v=pO1_F4X9rSk&list=PL4adbQCQMmobh0TnfGi8uu5N57c603ciG&index=207"
]
const OWNED_COLLECTIBLE_REDEEM = `mutation OwnedCollectibleRedeem ($input: OwnedCollectibleRedeemInput) {
  ownedCollectibleRedeem(input: $input) {
      redeemResponse
      redeemError
  }
}`

const REDEMPTION_VARIABLES = {
  "input": {
      "userId": "a290e9c0-b71e-11eb-8819-19d345947357",
      "collectibleId": "1408b220-106c-11ed-a80b-7d51ab7406fd",
      "additionalData": {
          "link": "https://www.youtube.com/watch?v=SJGuMtN_Ltc"
      }
  }
}

function getRedemptionVariables() {
  const randomSong = YOUTUBE_SONGS[Math.floor(Math.random() * YOUTUBE_SONGS.length)]

  return {
    "input": {
        "userId": "a290e9c0-b71e-11eb-8819-19d345947357",
        "collectibleId": "1408b220-106c-11ed-a80b-7d51ab7406fd",
        "additionalData": {
            "link": randomSong
        }
    }
  }
}

function getRequests(url:string, orgId: string, concurrency = 1) {
    return new Array(concurrency).fill(new Promise(async (r) => {
        const headers = new Headers({
          "Authorization": `Bearer ${Deno.env.get("TRUFFLE_API_KEY")}`,
        });
    
        if (orgId) {
          headers.append("x-org-id", orgId);
        }
        const res = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            query: OWNED_COLLECTIBLE_REDEEM,
            variables: getRedemptionVariables(),
          }),
          headers,
        });
        const data = await res.json();
        r(data?.data?.ownedCollectibleRedeem?.redeemResponse?.hasBroadcastEvent);
    }));
}
Deno.test('Load test', async () => {
    let status200=0, statusNon200=0;
    const totalRequests=1000;
    for(let i=0; i<100; i++) {
        const responses=await Promise.all(getRequests('https://mycelium.truffle.vip/graphql', "8e35b570-6c2f-11ec-bade-b32a8d305590"));
        for(const s of responses) {

          s ? status200++ : statusNon200++;
        }
    }
    assert(status200 === totalRequests);
});