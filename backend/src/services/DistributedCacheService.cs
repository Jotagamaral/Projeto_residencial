using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using backend.src.services.interfaces;

namespace backend.src.services;

public class DistributedCacheService : ICacheService
{
    private readonly IDistributedCache _distributedCache;

    public DistributedCacheService(IDistributedCache distributedCache)
    {
        _distributedCache = distributedCache;
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        var cachedData = await _distributedCache.GetStringAsync(key);
        
        if (string.IsNullOrEmpty(cachedData))
            return default;

        return JsonSerializer.Deserialize<T>(cachedData);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expirationTime = null)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expirationTime ?? TimeSpan.FromHours(1)
        };

        var serializedData = JsonSerializer.Serialize(value);
        await _distributedCache.SetStringAsync(key, serializedData, options);
    }

    public async Task RemoveAsync(string key)
    {
        await _distributedCache.RemoveAsync(key);
    }
}