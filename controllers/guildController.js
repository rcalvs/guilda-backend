const redis = require('../config/redisClient');

// Upload de dados da guilda (mantido igual)
exports.upload = async (req, res) => {
  try {
    const data = req.body;
    
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'Body deve ser um array de objetos.' });
    }

    // Salvar cada item no Redis com chave guilda:{id}
    const savedItems = [];
    for (const item of data) {
      if (!item.id) {
        continue; // Pular itens sem ID
      }
      
      const key = `guilda:${item.id}`;
      await redis.set(key, JSON.stringify(item));
      savedItems.push(item);
    }

    res.status(201).json({ 
      message: 'Dados salvos com sucesso.',
      saved: savedItems.length,
      total: data.length
    });
  } catch (err) {
    console.error('Erro ao fazer upload dos dados:', err);
    res.status(500).json({ error: 'Erro ao salvar dados da guilda.' });
  }
};

// ===== FUNÇÃO CORRIGIDA COM AGREGAÇÃO (V2) =====
exports.dataReceive = async (req, res) => {
  try {
    console.log('📊 Iniciando busca e agregação de dados...');
    
    // 1. Buscar TODAS as chaves
    const keys = await redis.keys('guilda:*');
    
    if (!keys || keys.length === 0) {
      console.log('⚠️ Nenhum dado encontrado no Redis');
      return res.json([]);
    }

    console.log(`📦 Encontradas ${keys.length} entradas no Redis`);

    // 2. Buscar todos os valores
    const values = await redis.mget(keys);
    
    // 3. Parse e validação
    const rawItems = values
      .filter(val => val !== null && val !== undefined)
      .map(val => {
        try {
          return JSON.parse(val);
        } catch (parseError) {
          console.warn('⚠️ Erro ao fazer parse de item:', parseError);
          return null;
        }
      })
      .filter(trade => {
        // ✅ CORREÇÃO: Aceitar tanto 'item' quanto 'itemName'
        const hasItem = trade && (trade.item || trade.itemName);
        
        // ✅ CORREÇÃO: Aceitar tanto 'price' quanto 'priceInCopper'
        const hasPrice = trade && (
          (trade.price !== null && trade.price !== undefined && trade.price > 0) ||
          (trade.priceInCopper !== null && trade.priceInCopper !== undefined && trade.priceInCopper > 0)
        );
        
        // Só aceitar trades com item E preço válido
        return hasItem && hasPrice;
      });

    console.log(`✅ ${rawItems.length} itens válidos com preço após parse`);

    if (rawItems.length === 0) {
      console.log('⚠️ Nenhum item com preço válido encontrado');
      return res.json({
        data: [],
        stats: {
          totalEntries: keys.length,
          entriesInPeriod: keys.length,
          matchedEntries: 0,
          itemsWithVolume: 0,
        }
      });
    }

    // 4. AGREGAÇÃO POR NOME DE ITEM
    const aggregationMap = new Map();

    rawItems.forEach(trade => {
      // ✅ CORREÇÃO: Usar 'item' em vez de 'itemName'
      const itemName = (trade.item || trade.itemName || '').trim();
      
      if (!itemName || itemName.length < 2) return;
      
      const itemNameLower = itemName.toLowerCase();
      
      if (!aggregationMap.has(itemNameLower)) {
        // Primeira vez que vemos este item
        aggregationMap.set(itemNameLower, {
          item: itemName, // Mantém capitalização original
          itemNameLower: itemNameLower,
          prices: [],
          timestamps: [],
          actions: [],
          volume: 0,
          interest: 0,
          totalPrice: 0,
        });
      }

      const aggregated = aggregationMap.get(itemNameLower);
      
      // Incrementa volume (quantidade de trades)
      aggregated.volume += 1;
      
      // ✅ CORREÇÃO: Aceitar tanto 'price' quanto 'priceInCopper'
      const price = trade.price || trade.priceInCopper;
      
      if (price && !isNaN(price) && price > 0) {
        aggregated.totalPrice += price;
        aggregated.prices.push(price);
      }
      
      // Guarda timestamp
      if (trade.timestamp) {
        aggregated.timestamps.push(new Date(trade.timestamp));
      }
      
      // Guarda ação (buy/sell)
      if (trade.action || trade.type) {
        aggregated.actions.push(trade.action || trade.type);
      }
      
      // Interest (menções/interesse)
      aggregated.interest += 1;
    });

    console.log(`🔢 ${aggregationMap.size} itens únicos após agregação`);

    // 5. CALCULAR MÉTRICAS E FORMATAR RESPOSTA
    const aggregatedData = Array.from(aggregationMap.values())
      .filter(agg => agg.prices.length > 0) // Só itens com preço
      .map(agg => {
        // Preço médio
        const currentPrice = agg.totalPrice / agg.prices.length;

        // Preço mínimo e máximo
        const minPrice = Math.min(...agg.prices);
        const maxPrice = Math.max(...agg.prices);

        // Calcular variação (precisa da baseline - por enquanto deixar 0)
        // O frontend vai calcular isso baseado na baseline dele
        const variation = 0;

        // Tendência simples baseada em timestamps
        let trend = '▬';
        if (agg.timestamps.length >= 3) {
          const sortedWithPrices = agg.timestamps
            .map((t, i) => ({ timestamp: t, price: agg.prices[i] }))
            .sort((a, b) => a.timestamp - b.timestamp);
          
          const midpoint = Math.floor(sortedWithPrices.length / 2);
          const recentPrices = sortedWithPrices.slice(midpoint).map(x => x.price);
          const oldPrices = sortedWithPrices.slice(0, midpoint).map(x => x.price);
          
          if (recentPrices.length > 0 && oldPrices.length > 0) {
            const recentAvg = recentPrices.reduce((sum, p) => sum + p, 0) / recentPrices.length;
            const oldAvg = oldPrices.reduce((sum, p) => sum + p, 0) / oldPrices.length;
            
            if (recentAvg > oldAvg * 1.05) trend = '↗';
            else if (recentAvg < oldAvg * 0.95) trend = '↘';
          }
        }

        // Confiança baseada no volume
        let confidence = 'Baixa';
        if (agg.volume >= 50) confidence = 'Alta';
        else if (agg.volume >= 20) confidence = 'Média';

        return {
          item: agg.item,
          currentPrice: parseFloat(currentPrice.toFixed(2)),
          minPrice: parseFloat(minPrice.toFixed(2)),
          maxPrice: parseFloat(maxPrice.toFixed(2)),
          variation, // Frontend vai recalcular
          trend,
          confidence,
          sellPrice: parseFloat((currentPrice * 1.05).toFixed(2)), // Sugestão: +5%
          sellRecommendation: agg.volume >= 20 ? 'Demanda Alta' : 'Mercado Ativo',
          volume: agg.volume,
          interest: agg.interest,
        };
      });

    // 6. ORDENAR POR VOLUME (maior primeiro)
    aggregatedData.sort((a, b) => b.volume - a.volume);

    console.log('✅ Dados agregados com sucesso!');
    console.log(`📈 Itens com volume: ${aggregatedData.length}`);
    if (aggregatedData.length > 0) {
      console.log(`📈 Top 5 itens por volume:`, 
        aggregatedData.slice(0, 5).map(i => `${i.item}: ${i.volume}`)
      );
    }

    // 7. RETORNAR RESPOSTA
    res.json({
      data: aggregatedData,
      stats: {
        totalEntries: keys.length,
        entriesInPeriod: keys.length,
        matchedEntries: aggregatedData.length,
        itemsWithVolume: aggregatedData.length,
      }
    });

  } catch (err) {
    console.error('❌ Erro ao buscar dados da guilda:', err);
    res.status(500).json({ error: 'Erro ao buscar dados da guilda.' });
  }
};