import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import {HiDocumentDownload} from 'react-icons/hi'
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { write, utils } from 'xlsx';
import { Button, Tooltip } from 'antd';


export default function ColumnaRadial(){
  const tweets = useSelector(state=> state.datosFiltrados)
  const location = useLocation();
  const currentUrl = location.pathname;
  const subUrl = currentUrl.startsWith('/dashboard/') ? currentUrl.substring('/dashboard/'.length) : '';
  const modeloSinEspacios = decodeURIComponent(subUrl.replace(/\+/g, " "));

  const tweetsFiltrados = tweets.filter(tweet => {
    const propiedadModelo = tweet[modeloSinEspacios];
    return Array.isArray(propiedadModelo) && propiedadModelo.length > 0;
  });

 


  // console.log(subUrl) //obtengo que modelo es
  const seriesArray = [...new Set(tweetsFiltrados.map(obj => obj.seriesName))];
  // console.log(seriesArray);
  
  let count;
  if (tweetsFiltrados.length > 0) {
    count = tweetsFiltrados.filter(tweet => tweet.hasOwnProperty(modeloSinEspacios) && tweet[modeloSinEspacios].length > 0).length;
  } else {
    count = tweets.filter(tweet => tweet.hasOwnProperty(modeloSinEspacios) && tweet[modeloSinEspacios].length > 0).length;
  }
  
  // console.log(count);

  
  const categoriasModelos = [
    { modelo: "Sentimientos", categorias: ["Agotamiento", "Apatía", "Alegría", "Altivez", "Amor", "Aversión", "Calma", "Certeza", "Compasión", "Deseo", "Desagrado", "Dolor", "Entusiasmo", "Frustración", "Humillación", "Ira", "Miedo", "Placer", "Satisfacción", "Tensión", "Tristeza", "Valor"] },
    { modelo: "Atributos%20de%20Personalidad", categorias: ["Agrado", "Antipatico", "Calidez", "Competencia comunicativa", "Conocimiento", "Creatividad", "Credibilidad", "Desconfianza", "Deshonestidad", "Dinamismo", "Firmeza", "Fragilidad", "Frialdad", "Honestidad", "Ignorancia", "Insensibilidad", "Insensibilidad social", "Inmoralidad", "Laboriosidad", "Moralidad", "Mediocridad", "No defensa de lo nacional", "Ociosidad", "Optimismo", "Pesimismo", "Responsable", "Respeto", "Sensibilidad", "Sensibilidad social", "Sociable"] },
    { modelo: "Atributos%20de%20Politicos", categorias: ["Abierto al diálogo", "Autoridad", "Cerrado al diálogo", "Competencia comunicativa", "Conocimiento", "Defensa de lo nacional", "Deshonestidad", "Experiencia", "Falta de autoridad", "Incoherencia", "Incompetencia comunicativa", "Inexperiencia", "Insensibilidad social", "Inpopular", "Ineptitud de gestión", "Ignorancia", "No defensa de lo nacional", "No respeto institucional", "Respeto institucional"] },
    { modelo: "Continuidad%20y%20cambio", categorias: ["Cambio", "Continuidad"] },
    { modelo: "Emociones%20B%C3%A1sicas%20(Plutchik)", categorias: ["Alegría", "Anticipación", "Aversión", "Confianza", "Ira", "Miedo", "Sorpresa", "Tristeza"] },
    { modelo: "Preocupaciones", categorias: ["Ambiente", "Conflictividad", "Corrupción", "Educación", "Inflación", "Salud", "Seguridad", "Trabajo", "Tránsito y transporte", "Vivienda"] },
    { modelo: "Preocupaciones%20-%20Ven", categorias: ["Ambiente", "Corrupción", "Educación", "Inflación", "Salud", "Seguridad", "Trabajo", "Tránsito y transporte", "Vivienda"] },
    { modelo: "Red%20motivacional%20del%20voto", categorias: ["Voto Blanco", "Voto Clientelar", "Voto Emocional", "Voto Ganador", "Voto Ideológico", "Voto Partidario", "Voto Plebiscitario", "Voto Racional", "Voto de Ira", "Voto del Miedo", "Voto por carisma", "Voto Útil"] },
    { modelo: "Voto%20Emocional%20y%20Racional", categorias: ["Voto Emocional", "Voto Racional"] }
  ];
  
  const categoriasModelosSelector = [
    { modelo: "Sentimientos", categorias: ["Agotamiento", "Apatía", "Alegría", "Altivez", "Amor", "Aversión", "Calma", "Certeza", "Compasión", "Deseo", "Desagrado", "Dolor", "Entusiasmo", "Frustración", "Humillación", "Ira", "Miedo", "Placer", "Satisfacción", "Tensión", "Tristeza", "Valor"] },
    { modelo: "Atributos de Personalidad", categorias: ["Agrado", "Antipatico", "Calidez", "Competencia comunicativa", "Conocimiento", "Creatividad", "Credibilidad", "Desconfianza", "Deshonestidad", "Dinamismo", "Firmeza", "Fragilidad", "Frialdad", "Honestidad", "Ignorancia", "Insensibilidad", "Insensibilidad social", "Inmoralidad", "Laboriosidad", "Moralidad", "Mediocridad", "No defensa de lo nacional", "Ociosidad", "Optimismo", "Pesimismo", "Responsable", "Respeto", "Sensibilidad", "Sensibilidad social", "Sociable"] },
    { modelo: "Atributos de Politicos", categorias: ["Abierto al diálogo", "Autoridad", "Cerrado al diálogo", "Competencia comunicativa", "Conocimiento", "Defensa de lo nacional", "Deshonestidad", "Experiencia", "Falta de autoridad", "Incoherencia", "Incompetencia comunicativa", "Inexperiencia", "Insensibilidad social", "Inpopular", "Ineptitud de gestión", "Ignorancia", "No defensa de lo nacional", "No respeto institucional", "Respeto institucional"] },
    { modelo: "Continuidad y cambio", categorias: ["Cambio", "Continuidad"] },
    { modelo: "Emociones Básicas (Plutchik)", categorias: ["Alegría", "Anticipación", "Aversión", "Confianza", "Ira", "Miedo", "Sorpresa", "Tristeza"] },
    { modelo: "Preocupaciones", categorias: ["Ambiente", "Conflictividad", "Corrupción", "Educación", "Inflación", "Salud", "Seguridad", "Trabajo", "Tránsito y transporte", "Vivienda"] },
    { modelo: "Preocupaciones - Ven", categorias: ["Ambiente", "Corrupción", "Educación", "Inflación", "Salud", "Seguridad", "Trabajo", "Tránsito y transporte", "Vivienda"] },
    { modelo: "Red motivacional del voto", categorias: ["Voto Blanco", "Voto Clientelar", "Voto Emocional", "Voto Ganador", "Voto Ideológico", "Voto Partidario", "Voto Plebiscitario", "Voto Racional", "Voto de Ira", "Voto del Miedo", "Voto por carisma", "Voto Útil"] },
    { modelo: "Voto Emocional y Racional", categorias: ["Voto Emocional", "Voto Racional"] }
  ];


const categorias = categoriasModelos.find(item => item.modelo === subUrl)?.categorias || [];


function crearRadar(tweets) {
  const categoriasMencionadas = categorias.flatMap(categoria => {
    const mencionesPorCategoria = seriesArray.map(seriesName => {
      const tweetsEnSeries = tweets.filter(tweet => tweet.seriesName === seriesName);
      const count = tweetsEnSeries.filter(
        tweet =>
          tweet.hasOwnProperty(modeloSinEspacios) &&
          tweet[modeloSinEspacios].includes(categoria)
      ).length;

      return {
        item: categoria,
        user: seriesName,
        score: count
      };
    });

    const totalMencionesCategoria = mencionesPorCategoria.reduce(
      (total, mencion) => total + mencion.score,
      0
    );

    return {
      categoria,
      menciones: totalMencionesCategoria
    };
  });

  // Ordenar las categorías por la cantidad de menciones de mayor a menor
  categoriasMencionadas.sort((a, b) => b.menciones - a.menciones);

  const categoriasFiltradas = categoriasMencionadas.slice(0, 10).map(
    mencion => mencion.categoria
  );

  return categoriasFiltradas.flatMap(categoria => {
    return seriesArray.map(seriesName => {
      const tweetsEnSeries = tweets.filter(tweet => tweet.seriesName === seriesName);
      const count = tweetsEnSeries.filter(
        tweet =>
          tweet.hasOwnProperty(modeloSinEspacios) &&
          tweet[modeloSinEspacios].includes(categoria)
      ).length;

      return {
        item: categoria,
        user: seriesName,
        score: count
      };
    });
  });
}

const datos = crearRadar(tweetsFiltrados)
// console.log(tweetsFiltrados);
// console.log(categorias);
// console.log(seriesArray);
// console.log(datos);

const maxScore = Math.max(...datos.map(item => item.score)); // Obtener el máximo valor de score en los datos


const config = {
  data: datos,
  xField: 'item',
  yField: 'score',
  seriesField: 'user',
  xAxis: {
    label: {
      autoRotate: false,
    },
  },
  slider: {
    start: 0,
    end: 1,
  },
  tooltip: {
    position: 'bottom',
    offset: 100,
      },
  isGroup: true,
  columnStyle: {
    radius: [20, 20, 0, 0],
  },
  interactions: [
    { 
      type: 'element-single-selected' 
    },
  ]
};

const handleDownloadExcel = () => {
  if (datos) {
    const worksheet = utils.json_to_sheet(datos);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Datos');
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    // Obtener la fecha actual
  const today = new Date();
  const date = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

  // Nombre del archivo con la fecha actual
  const fileName = `CategoriasCantidadEventos_${date}.xlsx`;

  saveAs(data, fileName);
    
  }
};

  return <div>
  <div className='titulo-carta'>Categorías</div>
  
   <div className='subtitulo-carta'>
        <div>Eventos por categoría</div>
        <Tooltip title="Descargar Excel">
        <Button onClick={handleDownloadExcel} type="primary" shape="circle"  className='subtitulo-boton'><HiDocumentDownload/></Button>
        </Tooltip>
      </div>
    <div className='carta'>
      <Column {...config} /></div>
    </div>
}