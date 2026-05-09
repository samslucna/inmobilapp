<!DOCTYPE html>
<html>


<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>test</title>


    <style>
        /* spacing */



        .container {
            display: flex;
            flex-direction: row;
            align-items: stretch;
            width: 100%;
        }


        table.tblone {

            width: 100%;
            border: none;
        }

        table.tbltwo {

            width: 30%;
            border-collapse: collapse;
            border: 1px solid gray;
            float: left;
        }


        table.tblthree {

            width: 30%;
            border-collapse: collapse;
            border: 1px solid gray;
            float: left;
        }

        th,
        td {
            padding: 5px;

            text-align: center;

        }

        .fl {
            display: inline;
            padding: 0;
        }

        label {
            display: inline-block;
            position: relative;
            bottom: 21px;
        }

        h4 {
            display: inline-block;
            /* Otros estilos para el párrafo */
        }

        fieldset {
            width: 45%;

            float: left;
        }

        .pjust {
            text-align: justify;
        }

        .title {
            text-align: center;
        }

        .firm {
            width: 40%;


            text-align: center;
        }

        .firmlist {

            display: flex;
            flex-direction: row;
        }
    </style>
</head>

<body>

    <h3 class="title">{{ $data['title'] }}</h3>
    <h3 class="title">CONTRATO DE PROMESA DE COMPRAVENTA:<h3>
            <p>{{ $data['date'] }}</p>
        </h3>

        <p class="pjust">EN LA CIUDAD DE TLAPA DE COMONFORT, GUERRERO, A LOS 24 DÍAS DEL MES DE MARZO DEL AÑO 2025,
            SE CELEBRA EL SIGUIENTE CONTRATO DE PROMESA DE COMPRA, POR UNA PARTE, LOS CC. <u>{{strtoupper($data['records']->seller->name)}}</u> Y <u>{{strtoupper($data['records']->seller->lastnames) }}</u>, COMO VENDEDORES, REPRESENTADOS EN ESTE ACTO POR
            SU APODERADO LEGAL EL C. OSCAR ELEUTERIO LEON FLORES, IDENTIFICÁNDOSE CON SU CREDENCIAL PARA
            VOTAR, EXPEDIDA POR EL INSTITUTO NACIONAL ELECTORAL, ACREDITANDO SU PERSONALIDAD DE APODERADO
            LEGAL, CON LA ESCRITURA PÚBLICA NÚMERO 55,801 (CINCUENTA Y CINCO MIL OCHOCIENTOS UNO), DE FECHA
            SEIS DE JUNIO DEL AÑO DOS MIL VEINTIDÓS, PASADA ANTE LA FE DEL LICENCIADO EDSON ELOHIM TAPIA
            GONZÁLEZ, NOTARÍA PÚBLICO NÚMERO DOS DEL DISTRITO NOTARIAL DE HIDALGO, DEL ESTADO DE GUERRERO
            Y POR LA OTRA PARTE C. <u>{{strtoupper($data['records']->buyer->name) .' '.strtoupper($data['records']->buyer->lastnames) }}</u>, COMO COMPRADOR Y SE IDENTIFICA CON SU
            CREDENCIAL PARA VOTAR CON FOTOGRAFÍA, EXPEDIDA POR EL INSTITUTO NACIONAL ELECTORAL,
            FOLIO <u>{{strtoupper($data['records']->buyer->dni) }}</u>, ANTE TESTIGOS QUE AL FINAL FIRMAN Y DAN FE, AL TENOR DE LAS
            DECLARACIONES Y CLAUSULAS SIGUIENTES:</p>

        <h3 class="title">------------------------------------DECLARACIONES--------------------------------<h3>

                <p class="pjust">

                    <strong> I</strong>.- DECLARA EL APODERADO: SER DE NACIONALIDAD MEXICANA, CON CAPACIDAD LEGAL PARAR CONTRATAR, CONVENIR Y OBLIGARSE A
                    FIRMAR CONTRATOS.
                </p>
                <p class="pjust">
                    <strong>II</strong>. DECLARA EL APODERADO: QUE SUS REPRESENTADOS, ADQUIRIERON MEDIANTE CONTRATO PRIVADO DE COMPRAVENTA, RATIFICADO
                    ANTE EL LICENCIADO FRANCISCO REYES GALVEZ, JUEZ MENOR DEL MUNICIPIO DE TLAPA DE COMONFORT GUERRERO, EL 03 DE SEPTIEMBRE
                    DE 1985, EL CUAL SE ENCUENTRA DEBIDAMENTE INSCRITO EN EL REGISTRO PÚBLICO DE LA PROPIEDAD Y DEL COMERCIO DEL GOBIERNO
                    DEL ESTADO DE GUERRERO, BAJO EL FOLIO DE DERECHOS REALES 21 DEL DISTRITO JUDICIAL DE MORELOS, DE FECHA 07 DE ABRIL DEL AÑO 1986,
                    MISMO INMUEBLE QUE CUENTA CON LAS SIGUIENTES SUPERFICIE, MEDIDAS Y COLINDANCIAS:
                </p>

                <p class="pjust">
                    SUPERFICIE: <u>{{$data['records']->property->m2 }} METROS CUADRADOS</u>;
                </p>


                <p class="pjust">
                    AL NORTE, MIDE DOS MIL METROS Y COLINDA CON PROPIEDAD QUE ERA DE LA SEÑORA JUSTA LAZO DE LOPEZ,
                    HOY EJIDO DE LOS POBLADORES DE AHUATEPEC. AL SUR MIDE SETECIENTOS DIEZ METROS Y COLINDA CON EL RIO DE ESTA CIUDAD;
                </p>


                <p class="pjust">
                    AL SUR MIDE SETECIENTOS DIEZ METROS Y COLINDA CON EL RIO DE ESTA CIUDAD;
                </p>

                <p class="pjust">
                    AL ORIENTE MIDE: DOS MIL DOSCIENTOS SESENTA METROS Y COLINDA CON PROPIEDAD QUE ERA DE JUAN ZAYAS Y DEL
                    FINADO SANTIAGO MOSSO, HOY PROPIEDAD DE ENRIQUE RODRÍGUEZ SIENDO LIMITE LA BARRANCA DE IGUALA-TLAXCO;

                </p>

                <p class="pjust">
                    AL PONIENTE DOS MIL OCHOCIENTOS CUARENTA METROS Y COLINDA CON PROPIEDAD QUE ERA DE LA SEÑORA A. DE LA FUENTE,
                    HOY PROPIEDAD DE LOS EJIDOS DE AHUATEPEC Y SAN FRANCISCO,
                    SIRVIENDO COMO LÍNEA DIVISORIA LA BARRANCA DENOMINADA DEL DIABLO.
                </p>

                <p class="pjust">
                    MISMO QUE SERÁ FRACCIONADO Y QUE EL PRESENTE CONTRATO SERÍA UN LOTE DE LA PRESENTE PROPIEDAD.
                </p>

                <p class="pjust">
                    <strong>III</strong>.- SIGUE DECLARANDO EL APODERADO, QUE SUS REPRESENTADOS, SON LEGÍTIMOS DUEÑOS DE LA PROPIEDAD ANTES DESCRITA, QUE POR
                    INTERESES PERSONALES HAN DECIDIDO FRACCIONARLO Y QUE, DE MOMENTO, DICHO PLANO SE ENCUENTRA EN PROCESO DE
                    REGULARIZACIÓN, PERO QUE DESDE ESTE MOMENTO SE OBLIGAN CON SU COMPRADOR A FIRMARLE LA ESCRITURA DEFINITIVA O
                    RATIFICARLE EL PRESENTE CONTRATO Y RESPETARLE LA POSESIÓN DEL LOTE MOTIVO DEL PRESENTE CONTRATO, SIEMPRE QUE SE
                    CUMPLA CON LO ESTABLECIDO EN EL MISMO.
                </p>

                <p class="pjust">
                    <strong>IV</strong>.- QUE EL DOMICILIO PARA OÍR Y RECIBIR TODA CLASE DE NOTIFICACIONES ES EL UBICADO EN:<u> CALLE DE LAS CUMBRES
                        SIN NUMERO, CÓDIGO POSTAL 41300, COLONIA EL POTRERO, TLAPA DE COMONFORT, GUERRERO.</u>

                </p>


                <p class="pjust">
                    <strong>V</strong>. DECLARA POR SU PARTE COMPRADOR: C. <u>{{strtoupper($data['records']->buyer->name) .' '.strtoupper($data['records']->buyer->lastnames) }}</u>, SER DE NACIONALIDAD MEXICANA, MAYOR
                    DE EDAD, CON CAPACIDAD ECONÓMICA Y LEGAL PARA CONTRATAR, CONVENIR Y OBLIGARSE, CON DOMICILIO EN: <u>{{$data['records']->buyer->address }}</u>.
                </p>

                <p class="pjust">
                    <strong>VI</strong>.- CONOCER Y ESTAR CONSCIENTE DE LAS PENAS EN QUE INCURREN A QUIENES DECLARAN FALSAMENTE,
                    POR LO QUE DE CONFORMIDAD SE OTORGAN LAS SIGUIENTES.
                </p>

                <h3 class="title">------------------------------------ CLAUSULAS -------------------------------<h3>

                        <p class="pjust">
                            <strong>PRIMERA</strong>.- EI C. OSCAR ELEUTERIO LEON FLORES, APODERADO LEGAL DE LOS CC. MARIA DEL PILAR LEON FLORES Y
                            TEOFILO FLORES ALCOCER, POR SU PROPIO DERECHO, VENDE, CEDE Y TRASPASA SIN RESERVA NI LIMITACIÓN ALGUNA
                            A FAVOR DE C. <u>{{strtoupper($data['records']->buyer->name) .' '.strtoupper($data['records']->buyer->lastnames) }}</u>, SIEMPRE Y CUANDO CUMPLA CON LO ESTABLECIDO EN
                            ESTE INSTRUMENTO, QUIEN COMPRA Y ADQUIERE PARA SÍ, EL LOTE MARCADO CON EL NÚMERO <u>{{$data['records']->property->id }}</u>, DE LA MANZANA <u>{{$data['records']->property->mz }}</u>,
                            DE LA CALLE <u>{{strtoupper($data['records']->property->address) }}</u>, DE LA COLONIA "MONTE TLAPA" (<u>{{$data['records']->property->stage }}°</u> ETAPA), AL NORESTE DE LA CIUDAD
                            DE TLAPA DE COMONFORT, EL CUAL SE ENCUENTRA LIBRE DE TODO GRAVAMEN Y AL CORRIENTE EN EL PAGO DE SU PAGO
                            PREDIAL Y EL MISMO QUE TIENE LAS SIGUIENTES MEDIDAS Y COLINDANCIAS:
                        </p>

                        <ul>
                            <li>AL NORESTE: 10:00 METROS Y COLINDA CON <u>{{strtoupper($data['records']->property->colin1) }}</u>,</li>
                            <li>AL SUROESTE: 10:00 METROS Y COLINDA CON <u>{{strtoupper($data['records']->property->colin2) }}</u> ,</li>
                            <li>AL SURESTE: 20:00 METROS Y COLINDA CON <u>{{strtoupper($data['records']->property->colin3) }}</u> ,</li>
                            <li>AL NOROESTE: 20:00 METROS Y COLINDA CON <u>{{strtoupper($data['records']->property->colin4) }}</u>.</li>
                        </ul>
                        <p class="pjust">
                            CON UNA SUPERFICIE DE 200 METROS CUADRADOS.
                        </p>



                        <p class="pjust">
                            <strong>SEGUNDA</strong>.- EL PRECIO ESTABLECIDO POR EL INMUEBLE MATERIA DEL PRESENTE CONTRATO Y QUE SE HA
                            PACTADO, ES DE $ {{number_format($data['records']->property->amount_init,2)}} ( {{$data['costpropertystring']}})
                        </p>

                        <p class="pjust">
                            <strong> TERCERA</strong>.- AMBAS PARTES ACUERDAN QUE EL PRECIO DEL PRESENTE CONTRATO SERÁ EN LA MODALIDAD DE CRÉDITO,
                            MISMO QUE SERÁ CUBIERTO DE LA SIGUIENTE MANERA;
                        </p>

                        <p class="pjust">
                            a) LA CANTIDAD DE $ {{number_format(($data['records']->advance),2)}} (<u>{{$data['partamounttxt']}}</u>), COMO ENGANCHE.
                        </p>

                        <p class="pjust">

                            b) EL RESTO, LOS $ {{number_format($data['minum'],2)}} (<u>{{$data['minumtxt']}}</u>), EN {{$data['records']->plazo}} MESES, LOS PAGOS SERÁN DE ${{number_format(($data['pay']),2)}} (<u>{{$data['paytxt']}}</u>).
                        </p>

                        <p class="pjust">
                            <strong> CUARTA</strong>.- LA PARTE VENDEDORA LE DA UNA TOLERANCIA DE HASTA DIEZ DÍAS DESPUÉS DE LA FECHA ESTABLECIDA PARA REALIZAR
                            EL PAGO, UNA VEZ TRANSCURRIDO LOS DÍAS SEÑALADOS EL COMPRADOR SE HARÁ ACREEDOR A UNA PENA CONVENCIONAL DEL 10% SOBRE SU MENSUALIDAD CORRESPONDIENTE.
                            EN CASO DE FUERZA MAYOR, NO PUEDA REALIZAR SU ABONO, DEBERÁ DE ACUDIR A LA OFICINA DE LA PARTE VENDEDORA DE MANERA INMEDIATA A MANIFESTAR EL MOTIVO DE SU ATRASO.
                        </p>

                        <p class="pjust">
                            <strong>QUINTA</strong>.- DECLARA LA PARTE VENDEDORA QUE A FALTA DE TRES MENSUALIDADES VENCIDAS SIN JUSTIFICACIÓN ALGUNA SERÁ MOTIVO DE CANCELACIÓN DEL PRESENTE CONTRATO Y SE APLICARÁ
                            LA PENA CONVENCIONAL QUE MÁS ADELANTE SE DETALLA A LA PARTE COMPRADORA.
                        </p>


                        <p class="pjust">
                            <strong> SEXTA</strong>.- PARA EL CASO DE INCUMPLIMIENTO DE LAS OBLIGACIONES CONTENIDAS EN EL PRESENTE INSTRUMENTO LAS PARTES PODRÁN OPTAR POR LA RESCISIÓN DEL CONTRATO, CON INDEPENDENCIA
                            DE HACER EFECTIVA LA PENA CONVENCIONAL PLASMADA, MISMA QUE SE MENCIONA MÁS ADELANTE, EN CUYO CASO, SE ESTARÁ DISPUESTO A LO SIGUIENTE:
                        </p>

                        <p class="pjust">
                            EN CASO DE QUE LA PARTE QUE DIERE LUGAR A LA RESCISIÓN FUERA "LA PARTE VENDEDORA", "LA PARTE COMPRADORA" PODRÁ OPTAR POR LA RESCISIÓN DEL PRESENTE CONTRATO Y SOLICITAR EL
                            PAGO DE LA PENA CONVENCIONAL PACTADA, ADEMÁS DE TENER DERECHO A QUE
                            SE LE REINTEGREN LAS CANTIDADES QUE HA ENTREGADO COMO ANTICIPO DEL PRECIO DEL TERRENO ADQUIRIDO, EN PARCIALIDADES COMO LA PARTE COMPRADORA ENTREGO A LA PARTE VENDEDORA EN PARCIALIDADES.
                        </p>


                        <p class="pjust">

                            EN CASO DE QUE LA PARTE QUE DIERE LUGAR A LA RESCISIÓN DEL PRESENTE CONTRATO FUERA "LA PARTE COMPRADORA: "LA PARTE VENDEDORA" PODRÁ RETENER DE LOS ANTICIPOS RECIBIDOS LA PENA CONVENCIONAL
                            PACTADA, DEVOLVIENDO A "LA PARTE COMPRADORA" EL REMANENTE SI ES QUE LO HUBIERE.
                        </p>
                        <p class="pjust">

                            <strong>SEPTIMA</strong>.- PARA LOS EFECTOS DE LO SEÑALADO EN LA CLÁUSULA QUE PRECEDE LAS PARTES FIJAN COMO PENA CONVENCIONAL EL 30 %, DE LOS PAGOS REALIZADOS A LA FECHA DE LA RECISIÓN.
                        </p>
                        <p class="pjust">
                            <strong>OCTAVA</strong>.- LAS PARTES ESTÁN DE ACUERDO EN QUE EL PRESENTE CONTRATO PRIVADO SE PODRÁ RATIFICAR ANTE LA FE DEL NOTARIO PÚBLICO QUE ELIJA "LA PARTE COMPRADORA",
                            CORRIENDO POR SU EXCLUSIVA CUENTA TODOS LOS GASTOS, DERECHOS, IMPUESTOS Y HONORARIOS QUE GENERE DICHA TRANSMISIÓN DE PROPIEDAD, EXCLUYENDO EL IMPUESTO SOBRE LA RENTA
                            QUE CORRESPONDE EN CASO DE GENERARSE A "LA PARTE VENDEDORA", OBLIGÁNDOSE ESTA ÚLTIMA A ENTREGAR TODA LA DOCUMENTACIÓN QUE LE SOLICITE EL FEDATARIO PÚBLICO CORRESPONDIENTE.
                        </p>
                        <p class="pjust">
                            <strong>NOVENA</strong>.- LAS PARTES MANIFIESTAN QUE EN LA CELEBRACIÓN DEL PRESENTE CONTRATO NO EXISTE DOLO, ERROR, LESIÓN, MALA FE, COACCIÓN, O LA EXISTENCIA DE ALGÚN VICIO EN EL
                            CONSENTIMIENTO QUE EN ESTE ACTO OTORGAN QUE PUDIESE INVALIDAR EL PRESENTE CONTRATO.
                        </p>
                        <p class="pjust">

                            <strong>DECIMA</strong>.- SERÁN CAUSAS DE RESCISIÓN DEL PRESENTE CONTRATO, CUALQUIER ACTO QUE REALICEN LAS PARTES EN CONTRAVENCIÓN A LO ESTABLECIDO EN LAS CLÁUSULAS QUE PRECEDEN,
                            ASÍ COMO LOS CASOS QUE SEÑALA LA LEGISLACIÓN CIVIL EN LA MATERIA.
                        </p>
                        <p class="pjust">

                            <strong>DECIMA PRIMERA</strong>.- PARA TODO LO RELACIONADO CON LA INTERPRETACIÓN Y CUMPLIMIENTO DEL PRESENTE CONTRATO LAS PARTES DESEAN QUE SE SUJETE A LAS LEYES Y TRIBUNALES DE LA
                            CIUDAD DE TLAPA DE COMONFORT DISTRITO JUDICIAL DE MORELOS, RENUNCIANDO AMBAS PARTES EL QUE PUDIERAN TENER EN UN FUTURO.
                        </p>
                        <p class="pjust">
                            <strong>DECIMA SEGUNDA</strong>.- PARA TODOS LOS EFECTOS LEGALES A QUE HAYA LUGAR LAS PARTES SEÑALAN LOS DOMICILIOS QUE A CONTINUACIÓN SE MENCIONAN:
                        </p>
                        <p class="pjust">
                            <strong>PARTE VENDEDORA</strong>. - CALLE DE LAS CUMBRES SIN NÚMERO, CÓDIGO POSTAL 41300, COLONIA EL POTRERO, TLAPA DE COMONFORT GUERRERO. -
                        </p>
                        <p class="pjust">
                            <strong>PARTE COMPRADORA</strong>.– <u>{{$data['records']->buyer->address }}</u>.
                        </p>

                        <p class="pjust">
                            <strong>DECIMA TERCERA</strong>.- AMBAS PARTES ACUERDAN QUE LA ESCRITURA PÚBLICA SE FIRMARA CUANDO LAS AUTORIDADES, ESTATALES Y MUNICIPALES DEN LAS AUTORIZACIONES,
                            CORRESPONDIENTES, MISMAS QUE YA SE ENCUENTRAN EN PROCESO DE REGULARIZACIÓN.
                        </p>
                        <p class="pjust">
                            <u> AMBAS PARTES ESTANDO CONFORMES CON EL CONTENIDO Y CLAUSULADO DEL PRESENTE CONTRATO LO FIRMAN POR DUPLICADO EL DÍA 24 DE MARZO DEL AÑO 2025 AL
                                MARGEN EN CADA UNA DE SUS HOJAS Y AL CALCE EN ESTA ÚLTIMA PARA TODOS LOS EFECTOS LEGALES A QUE HAYA LUGAR.
                            </u>
                        </p>
                        <p class="pjust"> </p>



                        <table class="tblone">
                            <tr>
                                <td>


                                    <p>_____________________________________ </p>
                                    <p> Q.B.P. OSCAR ELEUTERIO LEON FLORES </p>
                                    <p> EL VENDEDOR </p>

                                </td>
                                <td>

                                    <p>_____________________________________ </p>
                                    <p>{{strtoupper($data['records']->buyer->name) .' '.strtoupper($data['records']->buyer->lastnames) }} </p>
                                    <p> EL COMPRADOR </p>

                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>_____________________________________ </p>
                                    <p>L.C. ÁLVARO PANO HERNÁNDEZ</p>
                                    <p> TESTIGO </p>
                                </td>
                                <td>
                                    <p>_____________________________________ </p>
                                    <p>LIC. LUIS GERONIMO GODOY NAVA</p>
                                    <p> TESTIGO </p>
                                </td>
                            </tr>
                        </table>




</body>

</html>